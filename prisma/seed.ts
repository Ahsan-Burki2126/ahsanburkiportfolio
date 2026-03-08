import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("Ahsan@1234@admin##", 12);
  await prisma.adminUser.upsert({
    where: { username: "ahsanburki1819@gmail.com" },
    update: { password: hashedPassword },
    create: {
      username: "ahsanburki1819@gmail.com",
      password: hashedPassword,
    },
  });
  console.log("✓ Admin user created (ahsanburki1819@gmail.com)");

  // Create profile
  await prisma.profile.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "Ahsan Burki",
      location: "Waziristan, Pakistan",
      degree: "BS in Artificial Intelligence",
      gradDate: new Date("2026-06-21T00:00:00Z"),
      germanLevel: "A2",
      bio: "From the rugged mountains of Waziristan to the cutting edge of artificial intelligence — I build intelligent agents, immersive 3D web experiences, and applications that bridge cultures. Inspired by the poetry of Ghani Khan, I weave technology with cultural identity.",
    },
  });
  console.log("✓ Profile created");

  // Create projects
  const projects = [
    {
      title: "SafarDost",
      description:
        "A travel companion web application for Pakistan. Explore hidden gems, plan routes, and discover the culture and beauty of Pakistan — from the Karakoram Highway to the beaches of Gwadar.",
      techStack: "React, Flask, Python, TensorFlow, Google Maps API",
      category: "web",
      featured: true,
      order: 0,
      liveUrl: null,
      repoUrl: null,
    },
    {
      title: "AI Agent Framework",
      description:
        "An experimental framework for building context-aware AI agents that can reason, plan, and execute multi-step tasks autonomously using LLM orchestration.",
      techStack: "Python, LangChain, OpenAI, FastAPI",
      category: "ai",
      featured: false,
      order: 1,
    },
    {
      title: "Neural Style Transfer",
      description:
        "A deep learning project applying artistic styles to photographs using convolutional neural networks. Transforms ordinary photos into artwork inspired by famous painters.",
      techStack: "Python, TensorFlow, Keras, OpenCV",
      category: "ai",
      featured: false,
      order: 2,
    },
    {
      title: "Waziristan in 3D",
      description:
        "A collection of 3D renders and environments created in Blender, showcasing the landscapes, architecture, and cultural heritage of Waziristan.",
      techStack: "Blender, HDRI, Cycles Renderer",
      category: "3d",
      featured: false,
      order: 3,
    },
    {
      title: "Cinematic Pakistan",
      description:
        "A photography portfolio capturing Pakistan's diverse landscapes — from the snow-capped peaks of the north to the ancient ruins of Mohenjo-daro.",
      techStack: "Photography, Lightroom, Photoshop",
      category: "photography",
      featured: false,
      order: 4,
    },
    {
      title: "Portfolio OmniLab",
      description:
        "This very website — a hyper-modern portfolio built with Next.js, Three.js, and GSAP. Features a 3D AI brain, admin dashboard, and secure CV management system.",
      techStack: "Next.js, TypeScript, Three.js, GSAP, Prisma, Tailwind CSS",
      category: "web",
      featured: false,
      order: 5,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log(`✓ ${projects.length} projects created`);

  // Seed SiteContent - all editable content
  const contentItems = [
    // ===== HOME PAGE =====
    {
      key: "home_hero_subtitle_tag",
      value: "// system.identity",
      type: "text",
      page: "home",
      label: "Hero Subtitle Tag",
    },
    {
      key: "home_hero_name_first",
      value: "AHSAN",
      type: "text",
      page: "home",
      label: "Hero First Name",
    },
    {
      key: "home_hero_name_last",
      value: "BURKI",
      type: "text",
      page: "home",
      label: "Hero Last Name (Glitch)",
    },
    {
      key: "home_hero_title",
      value: "AI SYSTEMS ARCHITECT",
      type: "text",
      page: "home",
      label: "Hero Title",
    },
    {
      key: "home_hero_description",
      value:
        "Engineering intelligent agents and immersive web experiences from Waziristan to the world. Specializing in AI/ML systems, full-stack development, and 3D creative coding.",
      type: "text",
      page: "home",
      label: "Hero Description",
    },
    {
      key: "home_stats_hero",
      value: JSON.stringify([
        { target: 10, suffix: "+", label: "PROJECTS", duration: 2 },
        { target: 5, suffix: "+", label: "AI MODELS", duration: 2.2 },
        { target: 3, suffix: "", label: "LANGUAGES", duration: 1.5 },
      ]),
      type: "json",
      page: "home",
      label: "Hero Stats Counters",
    },
    {
      key: "home_process_steps",
      value: JSON.stringify([
        {
          number: "01",
          title: "RESEARCH",
          description:
            "Deep-dive into the problem space. Analyze data, study existing solutions, identify gaps.",
          icon: "🔍",
        },
        {
          number: "02",
          title: "ARCHITECT",
          description:
            "Design the system blueprint — APIs, data flow, model architecture, and user experience.",
          icon: "📐",
        },
        {
          number: "03",
          title: "BUILD",
          description:
            "Write clean, tested code. Train models. Iterate rapidly with continuous integration.",
          icon: "⚡",
        },
        {
          number: "04",
          title: "DEPLOY",
          description:
            "Ship to production. Monitor performance. Gather feedback. Optimize and evolve.",
          icon: "🚀",
        },
      ]),
      type: "json",
      page: "home",
      label: "Process Steps",
    },
    {
      key: "home_stats_banner",
      value: JSON.stringify([
        {
          target: 500,
          suffix: "+",
          label: "COMMITS",
          duration: 2.5,
          color: "var(--accent-cyan)",
        },
        {
          target: 15,
          suffix: "+",
          label: "REPOSITORIES",
          duration: 2,
          color: "var(--accent-purple)",
        },
        {
          target: 1000,
          suffix: "+",
          label: "CUPS OF COFFEE",
          duration: 3,
          color: "var(--accent-green)",
        },
        {
          target: 24,
          suffix: "/7",
          label: "UPTIME",
          duration: 1.5,
          color: "var(--accent-cyan)",
        },
      ]),
      type: "json",
      page: "home",
      label: "Stats Banner Counters",
    },
    {
      key: "home_testimonials",
      value: JSON.stringify([
        {
          name: "Dr. Ahmad Shah",
          role: "AI Research Supervisor",
          text: "Ahsan's work on intelligent agents demonstrates a rare combination of technical depth and creative vision. His projects consistently push boundaries.",
          initials: "AS",
        },
        {
          name: "Sara Khan",
          role: "Senior Developer, TechCorp",
          text: "One of the most talented full-stack developers I've worked with. His attention to detail and clean architecture is exceptional.",
          initials: "SK",
        },
        {
          name: "Rizwan Ali",
          role: "Project Lead, StartupPK",
          text: "Ahsan delivered SafarDost ahead of schedule with features we hadn't even thought of. A true innovator from Waziristan.",
          initials: "RA",
        },
      ]),
      type: "json",
      page: "home",
      label: "Testimonials",
    },
    {
      key: "home_cta_title",
      value: "LET'S BUILD SOMETHING TOGETHER",
      type: "text",
      page: "home",
      label: "CTA Title",
    },
    {
      key: "home_cta_description",
      value:
        "Whether it's an AI agent, a web application, or a creative experiment — I'm always open to new collaborations and ideas.",
      type: "text",
      page: "home",
      label: "CTA Description",
    },
    {
      key: "home_tech_stack",
      value: JSON.stringify([
        "Python",
        "TypeScript",
        "React",
        "Next.js",
        "Flask",
        "TensorFlow",
        "Three.js",
        "GSAP",
        "Prisma",
        "Blender",
      ]),
      type: "json",
      page: "home",
      label: "Tech Stack Bar",
    },

    // ===== ABOUT PAGE =====
    {
      key: "about_page_title",
      value: "ABOUT AHSAN",
      type: "text",
      page: "about",
      label: "Page Title",
    },
    {
      key: "about_bio",
      value: JSON.stringify([
        "From the rugged mountains of <highlight>Waziristan</highlight> to the cutting edge of artificial intelligence — my journey is one of relentless curiosity and cultural pride. I grew up surrounded by the rich traditions of <cyan>Pashto culture</cyan>, where storytelling and resilience are woven into the fabric of daily life.",
        "Inspired by the poetry of <purple>Ghani Khan</purple> — who bridged worlds between East and West — I found my own bridge in technology. Code became my language of expression, and AI became the canvas on which I paint possibilities.",
        "Today, as an <highlight>AI Engineer & Full-Stack Developer</highlight>, I build intelligent agents that understand context, craft immersive 3D web experiences, and develop applications like <cyan>SafarDost</cyan> — a travel companion designed to showcase the hidden beauty of Pakistan. My work sits at the intersection of machine learning, creative coding, and cultural identity.",
      ]),
      type: "json",
      page: "about",
      label: "Biography Paragraphs",
    },
    {
      key: "about_education",
      value: JSON.stringify({
        degree: "BS in Artificial Intelligence",
        gradDate: "2026-06-21T00:00:00Z",
        status: "IN_PROGRESS",
      }),
      type: "json",
      page: "about",
      label: "Education Info",
    },
    {
      key: "about_languages",
      value: JSON.stringify([
        { name: "English", level: "Professional", percent: 90 },
        { name: "Pashto", level: "Native", percent: 100 },
        { name: "German", level: "A2 / Duolingo", percent: 25 },
      ]),
      type: "json",
      page: "about",
      label: "Languages",
    },
    {
      key: "about_interests",
      value: JSON.stringify([
        { icon: "🤖", label: "AI Agents" },
        { icon: "🧠", label: "Machine Learning" },
        { icon: "📷", label: "Cinematic Photography" },
        { icon: "🎨", label: "3D Rendering (Blender)" },
        { icon: "💻", label: "Creative Coding" },
        { icon: "🌍", label: "Travel Tech" },
      ]),
      type: "json",
      page: "about",
      label: "Interests",
    },

    // ===== EXPERIENCE PAGE =====
    {
      key: "experience_page_title",
      value: "THE JOURNEY",
      type: "text",
      page: "experience",
      label: "Page Title",
    },
    {
      key: "experience_page_description",
      value:
        "A chronological record of pivotal moments, experiments, and milestones in the evolution of an AI systems architect.",
      type: "text",
      page: "experience",
      label: "Page Description",
    },
    {
      key: "experience_timeline",
      value: JSON.stringify([
        {
          year: "2022",
          title: "The Awakening",
          role: "Started BS in Artificial Intelligence",
          description:
            "Left the mountains of Waziristan with a burning curiosity for technology. Enrolled in AI degree, discovered the intersection of code and intelligence.",
          tags: ["Python", "Mathematics", "Linear Algebra"],
          type: "education",
        },
        {
          year: "2023",
          title: "First Neural Sparks",
          role: "ML Research & Web Development",
          description:
            "Built first machine learning models, developed web applications using React and Flask. Started exploring computer vision and NLP fundamentals.",
          tags: ["React", "Flask", "TensorFlow", "Computer Vision"],
          type: "project",
        },
        {
          year: "2023",
          title: "SafarDost Genesis",
          role: "Lead Developer — SafarDost Travel Platform",
          description:
            "Conceived and built SafarDost — an AI-powered travel companion to showcase Pakistan's hidden gems. Integrated intelligent recommendations, dynamic routing, and immersive UI.",
          tags: ["Next.js", "AI Agents", "Maps API", "Full-Stack"],
          type: "project",
        },
        {
          year: "2024",
          title: "Deep Learning Dive",
          role: "AI Agent Development & Research",
          description:
            "Specialized in building autonomous AI agents. Developed custom frameworks for multi-agent orchestration, prompt engineering, and tool-use architectures.",
          tags: ["LangChain", "GPT-4", "Agent Framework", "RAG"],
          type: "research",
        },
        {
          year: "2024",
          title: "Creative Coding Era",
          role: "3D Web & Cinematic Photography",
          description:
            "Merged technical skills with creative passion. Built immersive 3D web experiences with Three.js, captured cinematic photography of Pakistan's landscapes.",
          tags: ["Three.js", "Blender", "GSAP", "Photography"],
          type: "creative",
        },
        {
          year: "2025",
          title: "The OmniLab",
          role: "Full-Stack AI Engineer — Present",
          description:
            "Building production-grade AI systems, contributing to open-source, and developing this portfolio as a living experiment in creative coding and modern web architecture.",
          tags: ["Next.js 16", "Prisma", "TypeScript", "LLMs"],
          type: "present",
        },
      ]),
      type: "json",
      page: "experience",
      label: "Timeline Entries",
    },

    // ===== SKILLS PAGE =====
    {
      key: "skills_page_title",
      value: "SKILL MATRIX",
      type: "text",
      page: "skills",
      label: "Page Title",
    },
    {
      key: "skills_page_description",
      value:
        "A comprehensive breakdown of technical proficiencies, constantly evolving through experimentation and real-world deployment.",
      type: "text",
      page: "skills",
      label: "Page Description",
    },
    {
      key: "skills_categories",
      value: JSON.stringify([
        {
          title: "AI / Machine Learning",
          icon: "🧠",
          color: "var(--accent-purple)",
          skills: [
            { name: "Python", level: 92 },
            { name: "TensorFlow / Keras", level: 80 },
            { name: "LangChain / Agents", level: 88 },
            { name: "Prompt Engineering", level: 95 },
            { name: "NLP / Text Processing", level: 78 },
            { name: "Computer Vision", level: 72 },
          ],
        },
        {
          title: "Web Development",
          icon: "💻",
          color: "var(--accent-cyan)",
          skills: [
            { name: "TypeScript", level: 88 },
            { name: "React / Next.js", level: 90 },
            { name: "Node.js / Express", level: 82 },
            { name: "Prisma / Databases", level: 78 },
            { name: "REST / GraphQL APIs", level: 85 },
            { name: "Tailwind CSS", level: 92 },
          ],
        },
        {
          title: "Creative & 3D",
          icon: "🎨",
          color: "#f59e0b",
          skills: [
            { name: "Three.js / WebGL", level: 75 },
            { name: "GSAP Animations", level: 80 },
            { name: "Blender 3D", level: 70 },
            { name: "Cinematic Photography", level: 85 },
            { name: "UI / UX Design", level: 78 },
            { name: "Motion Graphics", level: 65 },
          ],
        },
        {
          title: "DevOps & Tools",
          icon: "⚙️",
          color: "var(--accent-green)",
          skills: [
            { name: "Git / GitHub", level: 90 },
            { name: "Docker", level: 68 },
            { name: "Linux / CLI", level: 82 },
            { name: "Vercel / AWS", level: 75 },
            { name: "CI / CD Pipelines", level: 70 },
            { name: "VS Code / Cursor", level: 95 },
          ],
        },
      ]),
      type: "json",
      page: "skills",
      label: "Skill Categories",
    },
    {
      key: "skills_radar",
      value: JSON.stringify([
        { name: "AI/ML", value: 0.88 },
        { name: "Frontend", value: 0.9 },
        { name: "Backend", value: 0.82 },
        { name: "Creative", value: 0.78 },
        { name: "DevOps", value: 0.72 },
        { name: "Research", value: 0.85 },
      ]),
      type: "json",
      page: "skills",
      label: "Radar Chart Data",
    },
    {
      key: "skills_currently_learning",
      value: JSON.stringify([
        {
          name: "Rust",
          status: "Exploring",
          note: "Systems-level AI performance",
        },
        {
          name: "CUDA / GPU Programming",
          status: "In Progress",
          note: "Custom ML kernel optimization",
        },
        {
          name: "German (B1)",
          status: "Active",
          note: "Language acquisition via Duolingo",
        },
        {
          name: "Kubernetes",
          status: "Exploring",
          note: "Container orchestration for ML pipelines",
        },
        {
          name: "WebGPU",
          status: "Researching",
          note: "Next-gen browser compute shaders",
        },
        {
          name: "Multimodal AI",
          status: "Active",
          note: "Vision-language model integration",
        },
      ]),
      type: "json",
      page: "skills",
      label: "Currently Learning",
    },
    {
      key: "skills_full_stack",
      value: JSON.stringify([
        "Python",
        "TypeScript",
        "JavaScript",
        "SQL",
        "HTML/CSS",
        "React",
        "Next.js",
        "Flask",
        "Express",
        "FastAPI",
        "TensorFlow",
        "PyTorch",
        "LangChain",
        "OpenAI API",
        "Prisma",
        "PostgreSQL",
        "SQLite",
        "MongoDB",
        "Three.js",
        "GSAP",
        "Tailwind",
        "Framer Motion",
        "Git",
        "Docker",
        "Vercel",
        "AWS",
        "Linux",
        "Blender",
        "Figma",
        "VS Code",
        "Cursor",
      ]),
      type: "json",
      page: "skills",
      label: "Full Tech Stack",
    },

    // ===== CONTACT PAGE =====
    {
      key: "contact_page_title",
      value: "ESTABLISH CONTACT",
      type: "text",
      page: "contact",
      label: "Page Title",
    },
    {
      key: "contact_page_description",
      value:
        "Open a secure communication channel. All transmissions are encrypted and stored safely.",
      type: "text",
      page: "contact",
      label: "Page Description",
    },
    {
      key: "contact_location",
      value: JSON.stringify({
        city: "Waziristan / Islamabad",
        country: "Pakistan",
        coordinates: "32.9°N, 69.9°E",
        sector: "WAZIRISTAN SECTOR",
      }),
      type: "json",
      page: "contact",
      label: "Location Info",
    },
    {
      key: "contact_system_status",
      value: JSON.stringify([
        { label: "UPLINK", status: "ACTIVE", color: "var(--accent-green)" },
        {
          label: "RESPONSE TIME",
          status: "< 24 HRS",
          color: "var(--accent-cyan)",
        },
        {
          label: "ENCRYPTION",
          status: "ENABLED",
          color: "var(--accent-green)",
        },
      ]),
      type: "json",
      page: "contact",
      label: "System Status",
    },

    // ===== FOOTER / GLOBAL =====
    {
      key: "footer_bio",
      value:
        "AI Systems Architect building intelligent agents and immersive digital experiences from Waziristan to the world.",
      type: "text",
      page: "global",
      label: "Footer Bio",
    },
    {
      key: "footer_social_links",
      value: JSON.stringify([
        {
          label: "GitHub",
          href: "https://github.com/Ahsan-Burki2126",
          icon: "GH",
        },
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/ahsan-ullah-burki-25496930b/",
          icon: "LI",
        },
        {
          label: "Twitter / X",
          href: "https://x.com/ahsanburki",
          icon: "X",
        },
      ]),
      type: "json",
      page: "global",
      label: "Social Links",
    },
    {
      key: "footer_status",
      value: JSON.stringify([
        {
          text: "All systems operational",
          color: "var(--accent-green)",
          pulse: true,
        },
        {
          text: "Open to opportunities",
          color: "var(--accent-cyan)",
          pulse: false,
        },
        {
          text: "Based in Pakistan",
          color: "var(--accent-purple)",
          pulse: false,
        },
      ]),
      type: "json",
      page: "global",
      label: "Footer Status Items",
    },
  ];

  for (const item of contentItems) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }
  console.log(`✓ ${contentItems.length} content items seeded`);

  console.log("\n🚀 Database seeded successfully!");
  console.log("   Admin login: ahsanburki1819@gmail.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
