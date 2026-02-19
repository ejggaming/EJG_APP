```markdown
# AI Orchestration System

This directory contains the AI agent orchestration system for the React + Vite frontend client.

## Structure
```

.orchestration/
├── agents/ # Specialized AI agent roles
│ ├── UI_ARCHITECT.md # Component architecture and design system
│ ├── FRONTEND_DEVELOPER.md # Feature implementation and business logic
│ ├── STATE_ARCHITECT.md # State management and data flow
│ ├── SECURITY_ENGINEER.md # Frontend security best practices
│ ├── TEST_ENGINEER.md # Testing strategies and implementation
│ ├── REVIEWER.md # Code review standards
│ ├── QA.md # Quality assurance and validation
│ └── PM.md # Project management and delivery
├── reports/ # Generated agent reports
│ ├── qa/ # QA reports and defect logs
│ ├── reviewer/ # Code review findings
│ └── test-engineer/ # Test execution reports
└── README.md # This file

```

## How to Use

### 1. Agent Roles
Each agent file defines a specialized role with:
- **Responsibilities**: What this agent handles
- **Guidelines**: How to approach tasks
- **Tools**: Available tools and commands
- **Workflows**: Step-by-step processes

### 2. Invoking Agents
When working on a task, reference the appropriate agent:

```

@UI_ARCHITECT - Design component hierarchy and layout
@FRONTEND_DEVELOPER - Implement pages, features, and integrations
@STATE_ARCHITECT - Design Zustand stores and TanStack Query patterns
@SECURITY_ENGINEER - Frontend security audit or fix
@TEST_ENGINEER - Write tests
@REVIEWER - Review code changes
@QA - Validate functionality and release readiness
@PM - Plan delivery and coordinate work

````

### 3. Workflow Example

```mermaid
graph LR
    A[Request] --> B[@UI_ARCHITECT]
    B --> C[@STATE_ARCHITECT]
    C --> D[@FRONTEND_DEVELOPER]
    D --> E[@TEST_ENGINEER]
    E --> F[@REVIEWER]
    F --> G[@QA]
    G --> H[@SECURITY_ENGINEER]
    H --> I[Deploy]
````

## Best Practices

1. **Always start with the architect** - Design before implementing
2. **Security first** - Consult security agent for auth flows and sensitive data
3. **Test as you build** - Invoke test engineer after implementation
4. **Review before merge** - Always use code reviewer
5. **Zod-first validation** - Keep schemas in `src/schema/<model>.schema.ts` and use schema-inferred types
6. **Component-driven** - Build small, reusable components before assembling pages

## Current Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: React 19 + Vite 7
- **Styling**: TailwindCSS 4
- **State Management**: Zustand 5
- **Server State**: TanStack React Query 5
- **Routing**: React Router DOM 7
- **Validation**: Zod 4
- **HTTP Client**: Axios
- **Notifications**: react-hot-toast
- **Utilities**: clsx + tailwind-merge
- **Linting**: ESLint 9

```

```
