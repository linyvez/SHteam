<div align="center">
  <img src="./apps/frontend/public/favicon.png" width="180" alt="SHteam Logo" />
  <p style="font-size: 50px; font-weight: bold; margin-top: 10px;">
    SHteam
  </p>
  <p style="font-size: 20px;">(Steam for Shaders)</p>
</div>

## Authors: Bilyi Andrii, Kyrylova Iryna, Shergina Oleksandra, Lushpak Viktoriia

SHteam is a specialized platform for discovering, testing, and collecting WebGL shaders. Think of it as Steam, but built specifically for graphics developers. Users can preview shaders in a live 3D environment, purchase them for their own projects, and interact with a community of creators.

## Technical Stack

- Common:

  ![TypeScipt](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square)

  ![React](https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge)

  ![NestJS](https://img.shields.io/badge/-NestJs-ea2845?style=flat-square&logo=nestjs&logoColor=white)

  ![Nginx](https://img.shields.io/badge/-NGINX-009639?style=flat&logo=nginx&logoColor=white)

  ![Docker](https://img.shields.io/badge/docker-257bd6?style=for-the-badge&logo=docker&logoColor=white)

- Identity (Authentification) Service:

  ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

  ![PostgreSQL](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)

- Catalog Service:

  ![MongoDB](https://img.shields.io/badge/-MongoDB-13aa52?style=for-the-badge&logo=mongodb&logoColor=white)

  ![MinIO](https://img.shields.io/badge/MinIO-C72E49?logo=minio&logoColor=fff)

  ![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)

  ![WebGL](https://img.shields.io/badge/WebGL-990000?logo=webgl&logoColor=white)

- Order Service:

  ![Cassandra](https://img.shields.io/badge/Cassandra-%231287B1.svg?logo=apache-cassandra&logoColor=white)

  ![Kafka](https://img.shields.io/badge/Kafka-231F20?logo=apachekafka&logoColor=white)

- Social Service:

  ![Neo4j](https://img.shields.io/badge/Neo4j-008CC1?logo=neo4j&logoColor=white)

## Architecture (Microservices)

- Identity Service: Handles authentication and profiles. Powered by NestJS, PostgreSQL (user data), and Redis (session management/failover).

- Catalog Service: Manages shader metadata and search using MongoDB for flexible storage of GLSL code.

- Order Service: Manages purchases and transaction history. Uses Kafka for asynchronous processing and Cassandra for fast event logging.

- Social Service: Manages user connections and recommendations. Built with Neo4j (GraphDB) to handle complex many-to-many relationships.

### Architectural Decisions

- Identity (Authentication) Service saves all user info (including password hash) in PostgreSQL. After login, the user is asigned with JWT token, expiration time = 1h. Users cannot access other pages apart from register/login if they do not have a token yet. After logout, token is deleted.

- Identity Service has 2 instances. When one fails/disconnects, requests are then navigated to the second alive instance. User data is saved, including session (token), no need to relogin.

- Nginx as API Gateway

- REST API

### Diagram

![](images/diagram.png)

## Requirements

- Node >=22.15.1
- npm >=10.9.2
- Docker Compose

## How to Run

1. Run Docker:

```
docker-compose up --build -d
```

2. Access the platform:

- http://localhost:5173

### Identity service failover test

0. Log in.

1. Kill one of the identity services:

```
docker stop shteam-identity-1
```

2. Go back to the website - session should stay the same, so there will be no need to login again.

## Demonstration

1. Login page:

![](images/login.png)

2. Catalog:

![](images/catalog.png)

3. Profile:

![](images/profile.png)

4. Try out and buy shaders:

![](images/apply-shader.png)

![](images/buy-shader.png)

5. Add friends:

![](images/add-friends.png)

6. Get recommendations from your friends network:

![](images/recommendations.png)

## Responsibilities:

- **Bilyi Andrii**: develop the Three.js renderer for client-side GLSL execution, configure a 3-node MongoDB Replica Set with a read-only fallback mode during loss of quorum
- **Kyrylova Iryna**: design the Neo4j graph model, implemented a Kafka Consumer to sync successful purchases with the social graph
- **Shergina Oleksandra**: implement Kafka producers/consumers for asynchronous order processing, design the Cassandra schema for immutable transaction event sourcing
- **Lushpak Viktoriia**: configure Nginx for load balancing across redundant NestJS instances, implement the Auth Service integrated with PostgreSQL and Redis
