# Redis Caching Strategies: Interactive Learning Experience

An interactive teaching artifact built for **Kalvium Skilling Courses (Instructional Designer Intern Task)**.

This project transforms complex backend caching concepts into an engaging, hands-on, 45-minute self-paced or instructor-led learning journey.

---

## 🌟 Topic Chosen
**Topic 9: Redis Caching Strategies: Cache-Aside, Write-Through, and Cache Invalidation**

### Why this topic?
Modern web architectures cannot scale without caching. While junior engineers frequently treat Redis as a simple key-value store, mastering the trade-offs between **Cache-Aside (Lazy Loading)**, **Write-Through (Immediate Consistency)**, and **Cache Invalidation (TTL, Events, Manual)** separates entry-level coders from senior system architects.

---

## 🚀 Key Features & Instructional Structure

Designed to be consumed within **45 minutes**:

1. **Chapter 1: The Core Problem & Redis Fundamentals (~5 min)**
   - Interactive Latency Simulator demonstrating the 100x speed difference between PostgreSQL disk I/O (~150ms) and Redis in-memory lookup (<1ms).
   - Core Redis primitives (`SET`, `GET`, `SETEX`, `TTL`, `DEL`).

2. **Chapter 2: Cache-Aside Pattern / Lazy Loading (~8 min)**
   - Detailed workflow breakdown.
   - **Interactive Live Laboratory:** Search keys (`user:1`, etc.), observe real-time state machine transitions (`CHECK_CACHE` → `CACHE_MISS` → `FETCH_DB` → `STORE_CACHE`), animated glowing data packets, live hit/miss ratios, and event logs.
   - Production-ready Node.js (`ioredis`) code implementation with error fallback.

3. **Chapter 3: Write-Through Pattern (~8 min)**
   - Analysis of dual-write persistence and guaranteed read hits.
   - **Interactive Sandbox:** Synchronously write updates, inspect latency timers (~120ms dual-write vs ~5ms read), hit rates, and operation logs.
   - Comparison with Write-Behind (Write-Back) asynchronous queues.

4. **Chapter 4: Cache Invalidation Strategies (~8 min)**
   - Exploration of Phil Karlton's famous computer science adage.
   - **Interactive Simulator** covering:
     - **TTL Auto-Expiration:** Visual draining countdown bars.
     - **Event-Driven Invalidation:** Pub/Sub notifications purging stale cluster nodes.
     - **Explicit Eviction:** Synchronous `DEL` upon database mutation.
   - Cache Stampede, Cache Penetration (Bloom filters), and Cache Avalanche mitigation recipes.

5. **Chapter 5: Architectural Trade-Off Matrix (~4 min)**
   - Filterable side-by-side comparison across Performance, Consistency, Cost/RAM, and Failure Resilience.
   - Senior Architect's rule of thumb.

6. **Chapter 6: Real-World Production Engineering Scenarios (~4 min)**
   - E-commerce Product Catalogs (Amazon/Shopify style).
   - Flash Sales & Ticket Drops (Atomic `DECRBY` + Write-Behind queue).
   - Session & Auth Token Management (Sliding window TTL).
   - Live Streaming Leaderboards (Redis Sorted Sets `ZSET`).

7. **Chapter 7: Knowledge Check Quiz (~4 min)**
   - 5 scenario-based questions with instant feedback, explanations, and score tracking.

8. **Chapter 8: Hands-On Engineering Sandbox (~4 min)**
   - Full interactive controller allowing users to toggle between Cache-Aside and Write-Through, execute custom key reads and writes, inspect live RAM vs PostgreSQL state, and observe telemetry.

---

## 🛠️ Technology Stack
- **Framework:** React 18, Vite
- **Animations:** Framer Motion (packet movement, state transitions, progress bars)
- **Icons:** Lucide React
- **Syntax Highlighting:** React Syntax Highlighter (Atom Dark theme)
- **Styling:** Modern dark theme CSS variables & CSS-in-JS

---

## 💻 Running the Project Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Steps
```bash
# 1. Navigate to the project directory
cd redis-caching-strategies

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the Vite development server
npm run dev
```

Open your browser at `http://localhost:5173` to explore the artifact!

### Building for Production
```bash
npm run build
```
The optimized bundle will be created inside the `dist/` directory.

---

## 🎥 Explanation Video Guide (Submission Deliverable #2)

When recording your walkthrough video, cover the following 5 points highlighted in the task guidelines:

1. **Why did you select this topic?**
   - High real-world relevance: Caching is critical for backend scale, cost reduction, and sub-millisecond API response times.
2. **How did you break down the concept for students?**
   - Started from the pain point (slow DB queries) → introduced the solution (Redis RAM) → taught the 2 core access patterns (Aside vs Through) → tackled the hardest challenge (Invalidation) → tested via quiz and hands-on lab.
3. **How do the interactive elements support learning?**
   - Students don't just read theory; they trigger requests, watch data packets animate between App, Redis, and Database, inspect latency timers, and experiment with real-time state machines.
4. **How would a student use this artifact?**
   - Follow the 45-minute paced navigation bar with real-time completion tracking, run simulations at each stage, test their knowledge with the quiz, and tinker in the sandbox.
5. **How is the concept relevant to real-world software engineering?**
   - Connects directly to high-throughput platforms like Netflix session tokens, Shopify product catalogs, and flash-sale inventory systems.

