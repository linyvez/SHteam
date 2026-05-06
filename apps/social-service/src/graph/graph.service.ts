import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as neo4j from 'neo4j-driver';
import { Driver } from 'neo4j-driver';

@Injectable()
export class GraphService implements OnModuleInit, OnModuleDestroy {
  private driver!: Driver;

  onModuleInit() {
    this.driver = neo4j.driver(
      process.env.NEO4J_URI || 'bolt://localhost:7687',
      neo4j.auth.basic(
        process.env.NEO4J_USER || 'neo4j', 
        process.env.NEO4J_PASSWORD || 'password123'
      )
    );
  }

  async onModuleDestroy() {
    await this.driver.close();
  }

  /**
   * ADD FRIEND
   * Creates or finds users and establishes a bidirectional FRIENDS_WITH relationship
   */
  async addFriend(userId: string, friendId: string) {
    const session = this.driver.session();
    try {
      const query = `
        MERGE (u1:User {id: $userId})
        MERGE (u2:User {id: $friendId})
        MERGE (u1)-[:FRIENDS_WITH]-(u2)
        RETURN u1, u2
      `;
      await session.run(query, { userId, friendId });
      return { success: true, message: 'Friend connection established' };
    } finally {
      await session.close();
    }
  }

  /**
   * GET SHADER RECOMMENDATIONS FROM FRIENDS
   * Finds shaders owned by friends that the current user doesn't own yet
   */
  async getRecommendations(userId: string) {
    const session = this.driver.session();
    try {
      // Cypher: User -> Friends -> Shaders owned by friends -> Filter out already owned shaders
      const query = `
        MATCH (u:User {id: $userId})-[:FRIENDS_WITH]-(friend:User)-[:OWNS]->(s:Shader)
        WHERE NOT (u)-[:OWNS]->(s)
        RETURN DISTINCT s.id AS recommendedShaderId, count(friend) AS friendOwnersCount
        ORDER BY friendOwnersCount DESC
        LIMIT 10
      `;
      const result = await session.run(query, { userId });
      return result.records.map(record => ({
        shaderId: record.get('recommendedShaderId'),
        ownedByFriends: record.get('friendOwnersCount').toNumber()
      }));
    } finally {
      await session.close();
    }
  }

  /**
   * RECORD PURCHASE
   * Triggered by Kafka consumer when a user acquires a new shader
   */
  async recordPurchase(userId: string, shaderId: string) {
    const session = this.driver.session();
    try {
      // Create User and Shader nodes if they don't exist, then create the OWNS relationship
      const query = `
        MERGE (u:User {id: $userId})
        MERGE (s:Shader {id: $shaderId})
        MERGE (u)-[:OWNS]->(s)
      `;
      await session.run(query, { userId, shaderId });
    } finally {
      await session.close();
    }
  }
}