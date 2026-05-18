CREATE KEYSPACE IF NOT EXISTS shteam_order_history
    WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1};


CREATE TABLE IF NOT EXISTS shteam_order_history.orders_by_id (
    user_id TEXT,
    shader_id TEXT,
    order_id TEXT,
    event_time TIMESTAMP,
    PRIMARY KEY (user_id, event_time, shader_id, order_id)
) WITH CLUSTERING ORDER BY (event_time DESC, shader_id ASC, order_id ASC);
