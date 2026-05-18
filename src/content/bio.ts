import type { Bio } from "./types";

export const bio: Bio = {
  name: "Alejandra Rincón Hidalgo",
  role: "Senior Data Scientist · PhD in Mathematics",
  positioning:
    "Mathematically grounded modeling of networks, mobility, and infectious disease — and the GenAI systems built around them.",
  location: "Berlin, Germany",
  languages: ["English", "Spanish"],
  about: [
    "I am a Senior Data Scientist at NET CHECK in Berlin, with a PhD in Mathematics. My work sits at the intersection of probabilistic modeling, network science, and modern AI systems — translating mathematical structure into decisions that hold up under uncertainty.",
    "In recent years that has meant inferring biological fitness of pathogens from mobility data, comparing empirical contact surveys against agent-based simulations, and shipping GenAI pipelines on AWS. I move comfortably between research questions and production constraints.",
    "Currently open to senior roles where rigor and pragmatism are both expected.",
  ],
  social: {
    linkedin: "https://www.linkedin.com/in/arinconh",
    twitter: "https://twitter.com/arinconh",
    email: "mailto:alrinconh@gmail.com",
  },
  cvs: {
    dataScience: { href: "/Alejandra_Rincon_CV.pdf", label: "Download CV (Data Science)" },
    mathematics: { href: "/Academic_CV.pdf", label: "Download CV (Academic)" },
  },
};
