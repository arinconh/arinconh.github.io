import type { ExpertiseArea } from "./types";

export const expertise: ExpertiseArea[] = [
  {
    id: "scientific-modeling",
    title: "Scientific Modeling & Statistics",
    description:
      "Bayesian inference, dynamical systems, and uncertainty quantification for problems where the model matters as much as the data.",
    tools: ["PyMC", "NumPyro", "JAX", "scipy", "Stan"],
  },
  {
    id: "ml-genai",
    title: "Machine Learning & GenAI",
    description:
      "Classical ML and modern LLM / agent stacks, from prototypes to deployed retrieval and reasoning systems.",
    tools: ["PyTorch", "scikit-learn", "LangGraph", "LangSmith", "MCP"],
  },
  {
    id: "data-engineering",
    title: "Data Engineering & MLOps",
    description:
      "Reproducible pipelines, orchestration, and APIs that turn one-off analyses into systems the team can run on Monday morning.",
    tools: ["Python", "SQL", "Apache Airflow", "FastAPI", "HPC"],
  },
  {
    id: "infrastructure",
    title: "Infrastructure & Cloud",
    description:
      "Production-grade deployment on managed AWS services, with cost and observability built in from the start.",
    tools: ["AWS Bedrock", "SageMaker", "S3", "QuickSight", "Docker"],
  },
  {
    id: "networks-mobility-epi",
    title: "Networks, Mobility & Epidemiology",
    description:
      "Applied scientific differentiator: co-location and contact data, mobility patterns, and infectious-disease dynamics at population scale.",
    tools: ["NetworkX", "EpiModel", "GPS co-location", "Agent-based models"],
  },
];
