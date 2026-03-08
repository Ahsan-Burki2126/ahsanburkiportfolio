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

  console.log("\n🚀 Database seeded successfully!");
  console.log("   Admin login: ahsanburki1819@gmail.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
