/**
 * Initial Seed Data for Olflaz Portfolio & CMS
 * Minecraft Creator & Godot Game Developer
 */

export const initialData = {
  appearance: {
    themePreset: "default", // default (Olflaz Dark), pure-black, dark-minimal, custom
    accentColor: "cyan",    // cyan, emerald, purple, amber, crimson, custom
    accentPrimaryHex: "#38bdf8",
    accentSecondaryHex: "#0ea5e9",
    bgPage: "#08090c",
    bgSurface: "#11141b",
    bgSurfaceAlt: "#161923",
    borderColor: "rgba(255, 255, 255, 0.08)",
    textMain: "#f1f4f9",
    textMuted: "#94a0b5",
    textLight: "#5f687a",
    btnTextColor: "#08090c",
    glowLevel: "subtle",    // off, low, subtle, medium, vibrant
    bgPattern: "none",      // none, grid, dots
    cardStyle: "solid",     // solid, glass
    headingWeight: "700",
    bgAtmosphereGlow: "subtle",
    bgShapeVisible: true,
    bgShapeOpacity: "0.2"
  },

  siteSettings: {
    siteName: "Olflaz",
    tagline: "Minecraft Creator & Godot Game Developer",
    siteDescription: "Official portfolio and hub for Olflaz — indie game developer, Godot programmer, and Minecraft content creator.",
    logoText: "OLFLAZ",
    faviconUrl: "",
    seoTitle: "Olflaz | Minecraft Creator & Godot Game Developer",
    seoDescription: "Explore indie games, Godot tutorials, Minecraft maps, and devlogs by Olflaz.",
    defaultSocialImage: ""
  },

  home: {
    heroTagline: "Minecraft Creator & Godot Game Developer",
    heroTitle: "Olflaz",
    heroSubtitle: "Crafting indie games with Godot & exploring Minecraft through creative challenges & mechanics.",
    heroBio: "Hey! I'm Olflaz. I develop indie games with Godot Engine and produce high-energy Minecraft content, map breakdowns, and game development tutorials.",
    primaryCtaText: "View My Projects",
    primaryCtaLink: "#/projects",
    secondaryCtaText: "Watch My Videos",
    secondaryCtaLink: "#/videos",
    avatarUrl: "",
    sections: [
      { id: "hero", name: "Hero Landing", title: "Hero", enabled: true },
      { id: "channel", name: "Channel Overview", title: "Channel & Creator Overview", enabled: true },
      { id: "projects", name: "Featured Projects", title: "Featured Projects", enabled: true },
      { id: "videos", name: "Featured Videos", title: "Featured Videos & Tutorials", enabled: true },
      { id: "about", name: "About Preview", title: "About Olflaz", enabled: true },
      { id: "skills", name: "Skills & What I Do", title: "Skills & Core Stack", enabled: true },
      { id: "cta", name: "Call To Action & Community", title: "Join The Community", enabled: true }
    ]
  },

  channelStats: {
    channelName: "Olflaz",
    subscribers: "45.2K",
    totalViews: "3.8M",
    videoCount: "84",
    projectCount: "12",
    description: "Creating entertaining Minecraft challenges, custom map breakdowns, and sharing in-depth Godot 4 game development tutorials and devlogs."
  },

  about: {
    name: "Olflaz",
    identity: "Minecraft Creator & Godot Game Developer",
    shortBio: "Hey! I'm Olflaz. I develop indie games with Godot Engine and produce high-energy Minecraft content, map breakdowns, and game development tutorials.",
    fullBio: "I have been passionate about game development and gaming content creation for over 5 years. I specialize in Godot Engine 4 (GDScript, modular game architecture, responsive 2D/3D physics) and custom Minecraft datapacks, adventure map design, and modded mechanics. My goal is to empower other creators through open-source tools and detailed tutorials while building fun, memorable indie gaming experiences.",
    avatarUrl: "",
    interests: [
      "Indie Game Development",
      "Minecraft Datapacks & Modding",
      "GDScript & Clean Game Architecture",
      "Low-Poly 3D Modeling with Blender",
      "Video Editing & Creative Storytelling",
      "Game Jams & Prototyping"
    ],
    gameDevBio: "Focusing on Godot 4.x for both 2D action platformers and 3D roguelites. I love crafting tight controls, state machine architectures, and modular systems that make game feel satisfying.",
    minecraftBio: "Designing custom adventure maps, unique survival challenges, and technical datapacks. Sharing the entire creative journey on YouTube with a vibrant community.",
    tools: [
      "Godot Engine 4.x",
      "GDScript",
      "Blender 3D",
      "Blockbench",
      "VS Code",
      "DaVinci Resolve",
      "OBS Studio",
      "Git & GitHub"
    ],
    skills: [
      {
        category: "Game Engines & Architecture",
        items: ["Godot 4.x", "Godot 3.x", "2D/3D Physics", "Tilemaps & Auto-tiling", "Particle Systems", "State Machines"]
      },
      {
        category: "Programming & Scripting",
        items: ["GDScript", "JavaScript", "Python", "Minecraft Datapacks (mcfunction)", "JSON & Data Schemas", "Git Version Control"]
      },
      {
        category: "3D Art & Asset Creation",
        items: ["Blender (Low-Poly)", "Blockbench", "Pixel Art & Texturing", "UV Mapping", "Basic Rigging & Animation"]
      },
      {
        category: "Content Production & Video",
        items: ["DaVinci Resolve", "OBS Studio", "Thumbnail Design", "Scriptwriting & Voiceover", "Community Management"]
      }
    ]
  },

  socialLinks: {
    youtube: "https://youtube.com/@olflaz",
    discord: "https://discord.gg/olflaz",
    github: "https://github.com/olflaz",
    twitter: "https://twitter.com/olflaz",
    twitch: "https://twitch.tv/olflaz",
    itch: "https://olflaz.itch.io",
    email: "contact@olflaz.com"
  },

  projects: [
    {
      id: "proj-1",
      slug: "shadow-leap",
      title: "Shadow Leap",
      category: "Godot Games",
      engine: "Godot 4.3",
      status: "In Development",
      devDate: "2024 - Present",
      shortDesc: "Fast-paced 2D shadow-manipulation platformer with fluid wall-jumping and responsive momentum physics.",
      fullDesc: "Shadow Leap is a precision 2D platformer where players can merge into dark surfaces to bypass deadly obstacles, slingshot off walls, and manipulate level lighting in real time. Built entirely in Godot 4.3 using GDScript with custom state machine architecture and tailor-made momentum physics.",
      thumbnail: "",
      screenshots: ["", "", ""],
      technologies: ["Godot 4.3", "GDScript", "Custom State Machines", "2D Lighting", "Aseprite"],
      features: [
        "Dynamic shadow-merging mechanics for vertical mobility",
        "Over 40 handcrafted challenge rooms",
        "Sub-pixel movement with coyote time and jump buffering",
        "Integrated speedrun timer and ghost replay system",
        "Full controller and customizable keybinding support"
      ],
      githubUrl: "https://github.com/olflaz/shadow-leap-core",
      demoUrl: "https://olflaz.itch.io/shadow-leap",
      youtubeUrl: "https://youtube.com/watch?v=mock-shadow-leap",
      tags: ["Godot", "Platformer", "GDScript", "Indie Game"],
      isFeatured: true
    },
    {
      id: "proj-2",
      slug: "aetheria-skyblock",
      title: "Aetheria Skyblock RPG",
      category: "Minecraft",
      engine: "Minecraft Java 1.21+",
      status: "Completed",
      devDate: "2023 - 2024",
      shortDesc: "An immersive Minecraft custom survival adventure map featuring 12 unique floating islands, custom boss fights, and datapack magic.",
      fullDesc: "Aetheria Skyblock transforms traditional vanilla skyblock into a rich RPG experience. Includes custom mob AI written in vanilla datapacks, unique weapon abilities, customized loot tables, progressive quest trees, and multi-phase boss encounters with zero client-side mods required.",
      thumbnail: "",
      screenshots: ["", "", ""],
      technologies: ["Minecraft Datapacks", "Blockbench", "WorldEdit", "JSON Schemas", "Custom AI"],
      features: [
        "12 distinct floating biome islands with custom flora & fauna",
        "3 multi-phase custom boss encounters with telegraph attacks",
        "100% vanilla compatible — no client mods required",
        "Over 35 custom weapons, relics, and consumable spells",
        "Integrated dynamic quest log and achievement tracker"
      ],
      githubUrl: "https://github.com/olflaz/aetheria-skyblock-datapack",
      demoUrl: "https://planetminecraft.com/project/aetheria-skyblock",
      youtubeUrl: "https://youtube.com/watch?v=mock-aetheria",
      tags: ["Minecraft", "Datapack", "Adventure Map", "Custom Bosses"],
      isFeatured: true
    },
    {
      id: "proj-3",
      slug: "godot-tilemap-tool",
      title: "Godot Auto-Tile & Dungeon Plugin",
      category: "Tools & Utilities",
      engine: "Godot 4.x",
      status: "Completed",
      devDate: "2024",
      shortDesc: "Open-source GDScript editor plugin that streamlines procedural room generation and auto-tiling in Godot 4.",
      fullDesc: "A lightweight, robust developer tool for Godot 4 that generates procedurally connected dungeon rooms using Binary Space Partitioning (BSP) and automatically applies Bitmask tilemaps with seamless room borders and collision shapes.",
      thumbnail: "",
      screenshots: ["", ""],
      technologies: ["Godot 4.x", "GDScript", "EditorPlugin API", "Procedural Generation"],
      features: [
        "One-click procedural dungeon layout generation",
        "Instant auto-tiling rule presets for 2D top-down & platformer grids",
        "Non-destructive editor preview with live seed tweaking",
        "Export generated maps directly to PackedScene",
        "Comprehensive documentation and sample scene templates"
      ],
      githubUrl: "https://github.com/olflaz/godot-dungeon-tilemap-tool",
      demoUrl: "https://godotengine.org/asset-library/asset/mock-tilemap",
      youtubeUrl: "https://youtube.com/watch?v=mock-tilemap-plugin",
      tags: ["Godot Plugin", "GDScript", "Open Source", "Procedural"],
      isFeatured: true
    },
    {
      id: "proj-4",
      slug: "chrono-blade",
      title: "Chrono Blade 3D",
      category: "Godot Games",
      engine: "Godot 4.3",
      status: "In Development",
      devDate: "2024 - Present",
      shortDesc: "3D Low-Poly Action Roguelite featuring time-rewind combo combat and procedural arena challenges.",
      fullDesc: "Chrono Blade is a 3D hack-and-slash game built in Godot 4. Players wield a temporal sword capable of reversing local enemy positions and slowing projectiles to execute high-damage air combos in shifting arena environments.",
      thumbnail: "",
      screenshots: ["", "", ""],
      technologies: ["Godot 4.3", "GDScript", "Blender 3D", "Custom Shaders", "Animation Tree"],
      features: [
        "Time-dilation combat system with dodge-offset mechanics",
        "Modular character animation blend trees in Godot",
        "Procedural enemy wave spawning with difficulty scaling",
        "Stylized low-poly aesthetic crafted in Blender",
        "Original dynamic sound fx and interactive combat music"
      ],
      githubUrl: "https://github.com/olflaz/chrono-blade-godot",
      demoUrl: "https://olflaz.itch.io/chrono-blade",
      youtubeUrl: "https://youtube.com/watch?v=mock-chrono-blade",
      tags: ["Godot 3D", "Action", "Roguelite", "Blender"],
      isFeatured: false
    },
    {
      id: "proj-5",
      slug: "voxelcraft-dungeons",
      title: "VoxelCraft Dungeons",
      category: "Minecraft",
      engine: "Minecraft Java 1.20+",
      status: "Completed",
      devDate: "2023",
      shortDesc: "Co-op rogue-like dungeon crawler map inside vanilla Minecraft with branching paths and boss arenas.",
      fullDesc: "A complete dungeon crawler mini-game built using command blocks, structure blocks, and custom loot mechanics. Supports 1-4 players with balanced class loadouts (Knight, Mage, Archer, Rogue).",
      thumbnail: "",
      screenshots: ["", ""],
      technologies: ["Minecraft Datapacks", "Command Blocks", "Structure Blocks", "Custom Resource Pack"],
      features: [
        "4 unique player classes with active skills",
        "5 tiered dungeon levels with varying room archetypes",
        "Smart reviving mechanics for multiplayer co-op",
        "Custom item textures using vanilla overrides",
        "End-game endless survival horde arena"
      ],
      githubUrl: "https://github.com/olflaz/voxelcraft-dungeons",
      demoUrl: "https://planetminecraft.com/project/voxelcraft-dungeons",
      youtubeUrl: "https://youtube.com/watch?v=mock-voxelcraft",
      tags: ["Minecraft", "Co-op", "Minigame", "Dungeon Crawler"],
      isFeatured: false
    },
    {
      id: "proj-6",
      slug: "gd-inventory-pro",
      title: "GD-Inventory Pro UI System",
      category: "Tools & Utilities",
      engine: "Godot 4.x",
      status: "Completed",
      devDate: "2024",
      shortDesc: "Modular grid-based inventory, equipment, and crafting framework for Godot 4 games.",
      fullDesc: "A highly customizable inventory system supporting drag-and-drop items, stack limits, equipment slots, recipe crafting, and persistent save/load via Resource serialization.",
      thumbnail: "",
      screenshots: ["", ""],
      technologies: ["Godot 4.x", "GDScript", "Control Nodes", "Resource Serialization"],
      features: [
        "Smooth drag & drop item manipulation across grids",
        "Configurable item rarities, tooltips, and stats",
        "Full keyboard and gamepad navigation support",
        "Built-in crafting table with recipe unlock logic",
        "Lightweight single-file data export format"
      ],
      githubUrl: "https://github.com/olflaz/gd-inventory-pro",
      demoUrl: "https://godotengine.org/asset-library/asset/mock-inventory",
      youtubeUrl: "https://youtube.com/watch?v=mock-inventory-system",
      tags: ["Godot", "UI Framework", "GDScript", "Open Source"],
      isFeatured: false
    }
  ],

  videos: [
    {
      id: "vid-1",
      title: "How I Built a Complete 2D Platformer in Godot 4.3 in 7 Days",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "",
      description: "A complete walkthrough of building Shadow Leap from scratch in Godot 4.3. Learn state machines, momentum physics, wall jumps, and level design tricks!",
      views: "142.5K views",
      uploadDate: "2 weeks ago",
      category: "Godot Tutorials",
      tags: ["Godot 4", "Game Dev", "Tutorial", "GDScript", "Platformer"],
      isFeatured: true
    },
    {
      id: "vid-2",
      title: "I Created a Hardcore Minecraft RPG World with Custom Bosses",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "",
      description: "I spent 100 days coding custom bosses, weapons, and dungeons into a single Minecraft world using pure datapacks. Here is what happened!",
      views: "98.2K views",
      uploadDate: "1 month ago",
      category: "Minecraft",
      tags: ["Minecraft", "Datapacks", "Hardcore", "Custom Bosses"],
      isFeatured: true
    },
    {
      id: "vid-3",
      title: "GDScript Architecture: State Machines Made Simple",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "",
      description: "Stop writing huge messy match statements in your player controller. Here is the cleanest way to implement finite state machines in Godot 4.",
      views: "65.4K views",
      uploadDate: "2 months ago",
      category: "Godot Tutorials",
      tags: ["GDScript", "Architecture", "Godot 4", "Code Quality"],
      isFeatured: false
    },
    {
      id: "vid-4",
      title: "Top 10 Godot 4 Tips That Will Save You Hours of Work",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "",
      description: "10 essential workflow tips, hidden shortcuts, and editor tricks in Godot 4 that will supercharge your game development speed.",
      views: "115.8K views",
      uploadDate: "3 months ago",
      category: "Godot Tutorials",
      tags: ["Godot Tips", "Productivity", "Indie Game Dev"],
      isFeatured: false
    },
    {
      id: "vid-5",
      title: "How to Make Custom Minecraft Datapacks from Scratch (Beginner Guide)",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "",
      description: "Everything you need to know to write your very first Minecraft datapack: functions, predicates, loot tables, and tick loops.",
      views: "54.1K views",
      uploadDate: "4 months ago",
      category: "Minecraft",
      tags: ["Minecraft Guide", "Datapack Tutorial", "Commands"],
      isFeatured: false
    },
    {
      id: "vid-6",
      title: "Devlog #1: Starting My 3D Action Roguelite in Godot 4",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeId: "dQw4w9WgXcQ",
      thumbnail: "",
      description: "Kicking off the development of Chrono Blade! Building the time-rewind combat mechanic, modeling characters in Blender, and testing combat feel.",
      views: "42.9K views",
      uploadDate: "5 months ago",
      category: "Devlogs",
      tags: ["Devlog", "Godot 3D", "Blender", "Indie Dev"],
      isFeatured: false
    }
  ],

  portfolio: [
    {
      id: "port-1",
      title: "Shadow Leap — 2D Platformer",
      category: "Game Development",
      technologies: "Godot 4.3, GDScript, Aseprite",
      role: "Solo Game Designer & Lead Programmer",
      result: "In Active Beta Testing; over 2,000 demo plays on itch.io",
      description: "Designed core mechanics, physics state machine, 40+ challenge levels, and sound system.",
      image: "",
      links: "https://olflaz.itch.io/shadow-leap",
      isFeatured: true
    },
    {
      id: "port-2",
      title: "Aetheria Skyblock RPG Map",
      category: "Minecraft",
      technologies: "Minecraft 1.21, Datapacks, Blockbench",
      role: "Lead World Designer & Datapack Engineer",
      result: "Over 35,000 downloads on Planet Minecraft",
      description: "Built custom RPG islands, scripted multi-phase boss AI in mcfunction, and designed custom weapon abilities.",
      image: "",
      links: "https://planetminecraft.com/project/aetheria-skyblock",
      isFeatured: true
    },
    {
      id: "port-3",
      title: "Chrono Blade 3D Roguelite",
      category: "Game Development",
      technologies: "Godot 4.3, Blender 3D, GDScript",
      role: "Lead Developer & 3D Artist",
      result: "Playable prototype with time-rewind mechanics",
      description: "Created 3D character models in Blender, animated combat movesets, and programmed responsive melee hitboxes in Godot.",
      image: "",
      links: "https://github.com/olflaz/chrono-blade-godot",
      isFeatured: true
    },
    {
      id: "port-4",
      title: "Godot Auto-Tile & Dungeon Plugin",
      category: "Programming",
      technologies: "Godot 4.x EditorPlugin API, GDScript",
      role: "Open Source Creator & Maintainer",
      result: "500+ stars on GitHub, integrated into Godot Asset Library",
      description: "Engineered procedural BSP room generator and bitmask autotiling tool with live editor viewport preview.",
      image: "",
      links: "https://github.com/olflaz/godot-dungeon-tilemap-tool",
      isFeatured: true
    },
    {
      id: "port-5",
      title: "Godot 4 Game Dev Tutorial Series",
      category: "Content Creation",
      technologies: "DaVinci Resolve, OBS, Godot 4",
      role: "Creator, Writer & Video Producer",
      result: "Over 500,000 cumulative views across 25 episodes",
      description: "Created structured video lessons on GDScript architecture, physics optimization, and UI construction.",
      image: "",
      links: "https://youtube.com/@olflaz",
      isFeatured: true
    },
    {
      id: "port-6",
      title: "Low-Poly Dungeon Asset Pack",
      category: "Other Projects",
      technologies: "Blender 3D, Substance Painter / GIMP",
      role: "3D Environmental Artist",
      result: "Modular kit with 60+ modular tiles, props, and lighting prefabs",
      description: "Crafted game-ready low-poly dungeon pillars, chests, traps, and wall modules optimized for Godot & Unity.",
      image: "",
      links: "https://olflaz.itch.io",
      isFeatured: false
    }
  ],

  media: [
    {
      id: "med-1",
      name: "shadow-leap-hero.png",
      url: "",
      type: "image/png",
      size: "1.2 MB",
      uploadedAt: "2024-08-10",
      usageCount: 2,
      usageLocation: "Shadow Leap (Project & Portfolio)"
    },
    {
      id: "med-2",
      name: "aetheria-skyblock-cover.png",
      url: "",
      type: "image/png",
      size: "2.4 MB",
      uploadedAt: "2024-07-22",
      usageCount: 3,
      usageLocation: "Aetheria Skyblock (Project, Video, Portfolio)"
    },
    {
      id: "med-3",
      name: "godot-plugin-banner.png",
      url: "",
      type: "image/png",
      size: "890 KB",
      uploadedAt: "2024-08-01",
      usageCount: 2,
      usageLocation: "Tilemap Tool (Project & Portfolio)"
    },
    {
      id: "med-4",
      name: "olflaz-avatar-main.png",
      url: "",
      type: "image/png",
      size: "450 KB",
      uploadedAt: "2024-06-15",
      usageCount: 4,
      usageLocation: "Hero Avatar, About Page, Admin Profile, Header"
    }
  ]
};
