import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client } from 'cassandra-driver';

@Injectable()
export class CassandraService implements OnModuleInit, OnModuleDestroy {
    private client: Client;

    async onModuleInit() {
        this.client = new Client({
        contactPoints: [process.env.CASSANDRA_URL ?? 'localhost:9042'],
        localDataCenter: 'shteam_datacenter',
        keyspace: 'shteam_order_history'
        });
        await this.client.connect();
    }

    async getOrders (userId: string) {
        const query = 'SELECT * FROM shteam_order_history.orders_by_id WHERE user_id = ?';
        const result = await this.client.execute(query, [userId]);
        return result.rows;
    }

    async writeOrder (user_id: string, shader_id: string, event_time: Date) {
        const query = 'INSERT INTO shteam_order_history.orders_by_id (user_id, shader_id, event_time) VALUES (?, ?, ?)';
        try {
            await this.client.execute(query, [user_id, shader_id, event_time], {prepare: true});
        } catch (err) {
            console.log('Failed to write to Cassandra', err);
        }

    }

    async onModuleDestroy() {
        await this.client.shutdown();
    }
}