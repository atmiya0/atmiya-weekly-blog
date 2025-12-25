# BrunswickGrotesque Font Files

This directory should contain your custom BrunswickGrotesque font files.

## Required Files

Add the following `.woff2` files to this directory:

```
src/fonts/
├── BrunswickGrotesque-Regular.woff2   (weight: 400)
├── BrunswickGrotesque-Medium.woff2    (weight: 500)
├── BrunswickGrotesque-SemiBold.woff2  (weight: 600)
└── BrunswickGrotesque-Bold.woff2      (weight: 700)
```

## Enabling the Custom Font

After adding your font files:

1. Open `src/app/layout.tsx`
2. Uncomment the `localFont` import at the top
3. Uncomment the `brunswickGrotesque` configuration
4. Update the `<body>` className to include the font variable:
   ```tsx
   <body className={`${brunswickGrotesque.variable} antialiased min-h-screen flex flex-col`}>
   ```

## Different Font Weights?

If your font files have different names or you only have some weights, update the `src` array in the `localFont()` configuration accordingly.

## Font Format

For best performance, use `.woff2` format. If you only have `.woff` or `.ttf` files, convert them using a tool like:
- [Transfonter](https://transfonter.org/)
- [Font Squirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator)
