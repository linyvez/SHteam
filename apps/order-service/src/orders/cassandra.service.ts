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

    async onModuleDestroy() {
        await this.client.shutdown();
    }
}