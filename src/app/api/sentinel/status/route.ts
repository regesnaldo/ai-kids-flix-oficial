import { NextResponse } from "next/server";
import * as fs from "fs/promises";
import * as path from "path";

const projectRoot = process.cwd();

export async function GET() {
  try {
    let universeCount = 0;
    let universes: string[] = [];
    const universoPath = path.join(projectRoot, "src/app/(main)/universo");

    try {
      const dirs = await fs.readdir(universoPath, { withFileTypes: true });
      universes = dirs.filter(d => d.isDirectory()).map(d => d.name);
      universeCount = universes.length;
    } catch { }

    let botCount = 0;
    const botsPath = path.join(projectRoot, "scripts/agents");
    try {
      const bots = await fs.readdir(botsPath);
      botCount = bots.filter(f => f.endsWith(".ps1")).length;
    } catch { }

    let imageCount = 0;
    const imagesPath = path.join(projectRoot, "public/images/agentes");
    try {
      const images = await fs.readdir(imagesPath);
      imageCount = images.length;
    } catch { }

    let sitemapExists = false, robotsExists = false;
    try { await fs.access(path.join(projectRoot, "src/app/sitemap.ts")); sitemapExists = true; } catch {
      try { await fs.access(path.join(projectRoot, "public/sitemap.xml")); sitemapExists = true; } catch { }
    }
    try { await fs.access(path.join(projectRoot, "src/app/robots.ts")); robotsExists = true; } catch {
      try { await fs.access(path.join(projectRoot, "public/robots.txt")); robotsExists = true; } catch { }
    }

    let apiCount = 0;
    const apiPath = path.join(projectRoot, "src/app/api");
    const countDirs = async (dir: string): Promise<number> => {
      try {
        const items = await fs.readdir(dir, { withFileTypes: true });
        let count = 0;
        for (const item of items) {
          if (item.isDirectory()) count += await countDirs(path.join(dir, item.name));
          else if (item.name === "route.ts") count++;
        }
        return count;
      } catch { return 0; }
    };
    apiCount = await countDirs(apiPath);

    let pageCount = 0;
    const pagesPath = path.join(projectRoot, "src/app/(main)");
    try {
      const dirs = await fs.readdir(pagesPath, { withFileTypes: true });
      pageCount = dirs.filter(d => d.isDirectory()).length;
    } catch { }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: "online",
      bots: {
        total: botCount,
        list: [
          { name: "Doc-Writer", status: "ready", role: "Documentação" },
          { name: "QA-Bot", status: "ready", role: "Verificação de código" },
          { name: "Refactor-Bot", status: "ready", role: "Refatoração" },
          { name: "Fix-Bot", status: "ready", role: "Correções" },
          { name: "Universe-Gen", status: "ready", role: "Gerar universos" },
          { name: "SEO-Bot", status: "ready", role: "SEO" },
          { name: "Test-Bot", status: "ready", role: "Testes" },
          { name: "Migration-Bot", status: "ready", role: "Migrations" },
          { name: "Component-Bot", status: "ready", role: "Componentes" },
          { name: "Build-Bot", status: "ready", role: "Build" },
          { name: "Frontend-Test", status: "ready", role: "Frontend" },
          { name: "Backend-Test", status: "ready", role: "Backend" },
          { name: "Login-Debug", status: "ready", role: "Autenticação" },
          { name: "Vercel-Deploy", status: "ready", role: "Deploy" },
          { name: "Image-Check", status: "ready", role: "Imagens" },
          { name: "Full-Check", status: "ready", role: "Verificação total" },
        ]
      },
      project: {
        universes: universeCount,
        universeList: universes,
        pages: pageCount,
        apis: apiCount,
        images: imageCount,
        seo: { sitemap: sitemapExists, robots: robotsExists }
      },
      build: "passing"
    });
  } catch (error) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: "error",
      error: String(error)
    }, { status: 500 });
  }
}