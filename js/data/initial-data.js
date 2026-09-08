/**
 * Initial Seed Data for Olflaz Portfolio & CMS
 * Minecraft Creator & Godot Game Developer
 */

export const initialData = {
  appearance: {
    // 1. PRESET & CORE IDENTITY
    themePreset: "default", // default (Olflaz Dark), pure-black, dark-minimal, custom
    accentColor: "cyan",

    // 2. CORE SURFACES & PALETTE
    bgPage: "#08090c",
    bgPageAlt: "#0c0e13",
    bgSurface: "#11141b",
    bgSurfaceAlt: "#161923",
    bgSurfaceHover: "#1b202c",
    bgSurfaceElevated: "#212737",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderSubtle: "rgba(255, 255, 255, 0.04)",
    borderHover: "rgba(255, 255, 255, 0.16)",
    borderDivider: "rgba(255, 255, 255, 0.08)",

    // 3. TEXT COLORS
    headingMainColor: "#f1f4f9",
    headingSecondaryColor: "#f1f4f9",
    textMain: "#f1f4f9",
    textMuted: "#94a0b5",
    textLight: "#5f687a",
    textDisabled: "#4b5563",
    textLink: "#38bdf8",
    textInverse: "#08090c",

    // 4. ACCENT COLORS
    accentPrimary: "#38bdf8",
    accentPrimaryHex: "#38bdf8",
    accentSecondary: "#0ea5e9",
    accentSecondaryHex: "#0ea5e9",
    accentHover: "#7dd3fc",
    accentHoverHex: "#7dd3fc",
    accentActive: "#0284c7",
    accentActiveHex: "#0284c7",
    accentSurfaceOpacity: 0.06,
    accentBorderOpacity: 0.22,

    // 5. COMPONENT COLORS
    btnBg: "#f1f4f9",
    btnText: "#08090c",
    btnPrimaryBg: "#f1f4f9",
    btnPrimaryText: "#08090c",
    btnPrimaryHoverBg: "#ffffff",
    btnSecondaryBg: "#161923",
    btnSecondaryText: "#f1f4f9",
    btnSecondaryBorder: "rgba(255, 255, 255, 0.08)",
    inputBg: "#161923",
    inputBorder: "rgba(255, 255, 255, 0.08)",
    inputFocusBorder: "#38bdf8",
    inputFocus: "#38bdf8",
    badgeBg: "#161923",
    badgeText: "#94a0b5",

    // 6. BACKGROUND ATMOSPHERE & LIGHT POINTS
    bgPattern: "none", // none, grid, dots
    bgAtmosphereGlow: "subtle", // off, low, subtle, medium, high
    bgAtmosphereOpacity: 0.035,
    bgGradientEnabled: true,
    bgGradientStart: "#08090c",
    bgGradientEnd: "#0c0e13",
    bgGradientAngle: "135deg",
    bgGradientOpacity: 1,
    bgVignetteEnabled: true,
    bgVignetteIntensity: 0.3,
    bgAmbientIntensity: 0.15,
    backgroundLightPoints: [
      { id: "light-1", color: "#38bdf8", opacity: 0.035, blur: 120, size: 600, posX: 50, posY: 0, enabled: true },
      { id: "light-2", color: "#38bdf8", opacity: 0.015, blur: 140, size: 700, posX: 85, posY: 35, enabled: true },
      { id: "light-3", color: "#38bdf8", opacity: 0.015, blur: 140, size: 700, posX: 15, posY: 75, enabled: true }
    ],

    // 7. GLOW & EFFECTS
    glowLevel: "subtle", // off, low, subtle, medium, high
    glowGlobalPreset: "subtle",
    glowIntensity: 1,
    glowGlobalIntensity: 1,
    glowGlobalOpacity: 0.2,
    glowGlobalBlur: 20,
    glowGlobalSpread: 0,
    glowButtonIntensity: 1,
    glowButtonBlur: 18,
    glowButtonOpacity: 0.25,
    glowCardHover: 1,
    glowCardFeatured: 1,
    glowCardOpacity: 0.06,
    glowNavActive: 1,
    glowNavActiveBlur: 12,
    glowAmbientBlur: 100,
    glowAmbientOpacity: 0.08,

    // 8. CARDS
    cardBg: "#11141b",
    cardProjectBg: "#11141b",
    cardVideoBg: "#11141b",
    cardPortfolioBg: "#11141b",
    cardFeaturedBg: "#161923",
    cardOpacity: 1,
    cardBorder: "rgba(255, 255, 255, 0.08)",
    cardBorderColor: "rgba(255, 255, 255, 0.08)",
    cardBorderOpacity: 1,
    cardBorderWidth: "1px",
    cardRadius: "10px",
    cardBorderRadius: "10px",
    cardShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
    cardShadowIntensity: 0.6,
    cardShadowBlur: 14,
    cardHoverLift: "3px",
    cardHoverScale: 1.0,
    cardHoverBorderBrightness: 1.3,
    cardHoverGlow: "0 12px 32px rgba(0, 0, 0, 0.7), 0 0 16px rgba(56, 189, 248, 0.06)",
    cardImageZoom: 1.025,
    cardOverrideProjects: false,
    cardOverrideVideos: false,
    cardOverridePortfolio: false,
    cardOverrideFeatured: false,

    // 9. BUTTONS
    btnRadius: "6px",
    btnBorderRadius: "6px",
    btnBorderWidth: "1px",
    btnPaddingY: "0.6rem",
    btnPaddingX: "1.25rem",
    btnHoverLift: "2px",
    btnHoverScale: 1.01,
    btnHoverBrightness: 1.1,
    btnActiveScale: 0.985,
    btnTransitionSpeed: "140ms",

    // 10. TYPOGRAPHY
    heroFontSize: "2.75rem",
    heroFontWeight: "800",
    heroHeadingSize: "2.75rem",
    heroHeadingWeight: "800",
    heroHeadingColor: "#f1f4f9",
    heroHeadingLetterSpacing: "-0.03em",
    heroHeadingLineHeight: 1.25,
    heroLetterSpacing: "-0.03em",
    heroLineHeight: 1.25,
    sectionFontSize: "1.5rem",
    sectionFontWeight: "700",
    sectionHeadingSize: "1.5rem",
    sectionHeadingWeight: "700",
    sectionHeadingColor: "#f1f4f9",
    sectionHeadingLetterSpacing: "-0.02em",
    cardTitleSize: "1.25rem",
    cardTitleWeight: "700",
    cardHeadingSize: "1.25rem",
    cardHeadingWeight: "700",
    bodyFontSize: "1rem",
    bodyFontWeight: "400",
    bodyTextSize: "1rem",
    bodyTextWeight: "400",
    bodyTextColor: "#f1f4f9",
    bodyLineHeight: 1.65,
    bodyLetterSpacing: "0",
    mutedTextColor: "#94a0b5",
    mutedOpacity: 1,

    // 11. LAYOUT & SPACING
    containerMaxWidth: "1200px",
    sectionSpacing: 0,
    sectionSpacingY: "0px",
    sectionPaddingY: "64px",
    gridGap: "24px",
    cardGap: "24px",
    navbarHeight: "64px",
    containerPaddingX: "24px",

    // 12. NAVBAR
    navBg: "rgba(8, 9, 12, 0.92)",
    navbarBg: "rgba(8, 9, 12, 0.92)",
    navBgOpacity: 1,
    navbarBgOpacity: "0.92",
    navBlur: "12px",
    navbarBackdropBlur: "12px",
    navBorderOpacity: 0.08,
    navbarBorderOpacity: "0.08",
    navHeight: "64px",
    navLogoSize: "18px",
    navbarLogoSize: "18px",
    navTextColor: "#94a0b5",
    navbarTextColor: "#94a0b5",
    navActiveColor: "#38bdf8",
    navbarActiveColor: "#38bdf8",
    navHoverColor: "#ffffff",
    navbarHoverColor: "#ffffff",
    navbarActiveGlow: "1",
    navbarTransitionSpeed: "140ms",

    // 13. FOOTER
    footerBg: "#0c0e13",
    footerBorder: "rgba(255, 255, 255, 0.08)",
    footerBorderColor: "rgba(255, 255, 255, 0.08)",
    footerHeadingColor: "#ffffff",
    footerTextColor: "#94a0b5",
    footerMutedColor: "#5f687a",
    footerLinkColor: "#94a0b5",
    footerAccentColor: "#38bdf8",
    footerSpacingY: "48px",
    footerSpacing: "48px",

    // 14. ANIMATIONS
    hoverAnimationsEnabled: true,
    animHoverLift: "6px",
    animHoverScale: 1.02,
    animHoverGlow: "rgba(56, 189, 248, 0.15)",
    animTransitionSpeed: "250ms",
    buttonPressAmount: "0.985",
    scrollRevealEnabled: true,
    scrollSlideDistance: "80px",
    scrollDuration: "800ms",
    scrollEasing: "cubic-bezier(0.16, 1, 0.3, 1)",
    scrollTriggerDistance: "0px",

    // 15. SCROLL PROGRESS
    scrollProgressEnabled: true,
    scrollProgressColor: "#38bdf8",
    scrollProgressWidth: "3px",
    scrollProgressHeight: "180px",
    scrollProgressOpacity: 1,
    scrollProgressGlow: "rgba(56, 189, 248, 0.22)",
    scrollProgressRight: "10px",
    scrollProgressBorderRadius: "9999px",
    scrollProgressTransitionSpeed: "100ms",
    scrollProgressMobile: true,

    // 16. DECORATIVE SHAPES
    shapesEnabled: true,
    decorativeShapes: [
      {
        id: "shape-1",
        type: "circle",
        shapeType: "circle",
        posX: 10,
        posY: 12,
        width: 350,
        height: 350,
        rotation: 0,
        opacity: 0.03,
        blur: 80,
        color: "#38bdf8",
        border: "none",
        borderOpacity: 0,
        layer: "-1",
        animated: true,
        animationSpeed: "18s",
        enabled: true
      },
      {
        id: "shape-2",
        type: "ring",
        shapeType: "ring",
        posX: 88,
        posY: 45,
        width: 280,
        height: 280,
        rotation: 45,
        opacity: 0.02,
        blur: 40,
        color: "#0ea5e9",
        border: "2px solid rgba(56, 189, 248, 0.2)",
        borderOpacity: 0.2,
        layer: "-1",
        animated: false,
        animationSpeed: "0s",
        enabled: true
      }
    ]
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
