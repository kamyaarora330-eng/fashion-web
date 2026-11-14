import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Commencing MODÉRA Database Seeding ---');

  // 1. Upsert Store Settings
  const settings = await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      storeName: 'MODÉRA',
      contactEmail: 'concierge@modera-fashion.com',
      contactPhone: '+91 98765 43210',
      currency: 'INR',
      gstPercent: 12.0,
      freeShippingThreshold: 1999.0,
      standardShippingFee: 149.0,
      codEnabled: true,
      codFee: 49.0,
      announcementText: 'Complimentary Express Delivery on orders above ₹1,999 across India | Code: MODERA10',
    },
  });
  console.log('✓ Store settings initialized');

  // 2. Upsert Initial Admin & Customer
  const adminPassword = await bcrypt.hash('Modera@Admin2026!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@modera-fashion.com' },
    update: { role: 'ADMIN' },
    create: {
      firstName: 'Vikramaditya',
      lastName: 'Singhania',
      email: 'admin@modera-fashion.com',
      passwordHash: adminPassword,
      phone: '+91 98111 22233',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const customerPassword = await bcrypt.hash('Customer@123!', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@modera-fashion.com' },
    update: {},
    create: {
      firstName: 'Aanya',
      lastName: 'Kapoor',
      email: 'customer@modera-fashion.com',
      passwordHash: customerPassword,
      phone: '+91 98222 33344',
      role: 'CUSTOMER',
      isActive: true,
      addresses: {
        create: {
          fullName: 'Aanya Kapoor',
          phone: '+91 98222 33344',
          streetAddress: '42, Boulevard Towers, Altamount Road',
          apartment: 'Penthouse 14B',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400026',
          country: 'India',
          isDefault: true,
          addressType: 'HOME',
        },
      },
    },
  });
  console.log('✓ Admin and test customer seeded');

  // 3. Upsert Active Coupons
  const now = new Date();
  const future = new Date();
  future.setFullYear(now.getFullYear() + 2);

  await prisma.coupon.upsert({
    where: { code: 'MODERA10' },
    update: {},
    create: {
      code: 'MODERA10',
      description: '10% welcome privilege across all collections',
      discountType: 'PERCENTAGE',
      discountValue: 10.0,
      minOrderAmount: 1499.0,
      maxDiscountAmount: 2000.0,
      startDate: now,
      endDate: future,
      usageLimit: 10000,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FESTIVE20' },
    update: {},
    create: {
      code: 'FESTIVE20',
      description: 'Festive season discount for luxury ensembles',
      discountType: 'PERCENTAGE',
      discountValue: 20.0,
      minOrderAmount: 4999.0,
      maxDiscountAmount: 5000.0,
      startDate: now,
      endDate: future,
      usageLimit: 5000,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FIRST500' },
    update: {},
    create: {
      code: 'FIRST500',
      description: 'Flat ₹500 off on orders above ₹2,999',
      discountType: 'FIXED',
      discountValue: 500.0,
      minOrderAmount: 2999.0,
      startDate: now,
      endDate: future,
      usageLimit: 5000,
      isActive: true,
    },
  });
  console.log('✓ Promotional coupons created');

  // 4. Categories (Men & Women)
  const menCategories = [
    { name: 'Shirts', slug: 'men-shirts', gender: 'MEN', displayOrder: 1 },
    { name: 'T-Shirts', slug: 'men-tshirts', gender: 'MEN', displayOrder: 2 },
    { name: 'Jackets', slug: 'men-jackets', gender: 'MEN', displayOrder: 3 },
    { name: 'Trousers', slug: 'men-trousers', gender: 'MEN', displayOrder: 4 },
    { name: 'Ethnic Wear', slug: 'men-ethnic', gender: 'MEN', displayOrder: 5 },
    { name: 'Polo Shirts', slug: 'men-polo', gender: 'MEN', displayOrder: 6 },
    { name: 'Hoodies & Sweatshirts', slug: 'men-hoodies', gender: 'MEN', displayOrder: 7 },
    { name: 'Formal Wear', slug: 'men-formal', gender: 'MEN', displayOrder: 8 },
  ];

  const womenCategories = [
    { name: 'Dresses', slug: 'women-dresses', gender: 'WOMEN', displayOrder: 1 },
    { name: 'Kurtis & Sarees', slug: 'women-ethnic', gender: 'WOMEN', displayOrder: 2 },
    { name: 'Co-ord Sets', slug: 'women-coord-sets', gender: 'WOMEN', displayOrder: 3 },
    { name: 'Tops & Shirts', slug: 'women-tops', gender: 'WOMEN', displayOrder: 4 },
    { name: 'Jackets & Blazers', slug: 'women-jackets', gender: 'WOMEN', displayOrder: 5 },
    { name: 'Skirts & Trousers', slug: 'women-bottoms', gender: 'WOMEN', displayOrder: 6 },
  ];

  const createdCategories = {};
  for (const cat of [...menCategories, ...womenCategories]) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        gender: cat.gender,
        displayOrder: cat.displayOrder,
      },
    });
    createdCategories[cat.slug] = c.id;
  }
  console.log('✓ Categories generated');

  // 5. Curated Luxury Products
  const productsData = [
    // Men's Products
    {
      name: 'Artisanal Egyptian Cotton Tuxedo Shirt',
      slug: 'artisanal-egyptian-cotton-tuxedo-shirt',
      sku: 'MOD-MSH-001',
      description: 'Crafted from handpicked 140s two-ply Egyptian Giza cotton, featuring mother-of-pearl buttons, a French collar, and hand-stitched cuffs.',
      details: '100% Egyptian Giza Cotton | French Cuffs | Dry Clean Only | Made in India',
      gender: 'MEN',
      categorySlug: 'men-shirts',
      originalPrice: 6999,
      sellingPrice: 5499,
      discountPercent: 21,
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      ],
      variants: [
        { size: '38 (S)', colorName: 'Crisp Ivory', colorHex: '#FBFBFA', stock: 15 },
        { size: '40 (M)', colorName: 'Crisp Ivory', colorHex: '#FBFBFA', stock: 20 },
        { size: '42 (L)', colorName: 'Crisp Ivory', colorHex: '#FBFBFA', stock: 18 },
        { size: '44 (XL)', colorName: 'Crisp Ivory', colorHex: '#FBFBFA', stock: 10 },
        { size: '40 (M)', colorName: 'Midnight Navy', colorHex: '#1B263B', stock: 12 },
      ],
    },
    {
      name: 'Supima Heavyweight Minimalist Tee',
      slug: 'supima-heavyweight-minimalist-tee',
      sku: 'MOD-MTS-002',
      description: 'Ultra-luxurious 260 GSM long-staple Supima cotton t-shirt with a structured drape and velvety finish that softens with age.',
      details: '100% Organic Supima Cotton | Pre-shrunk | Ribbed Collar | Tailored Cut',
      gender: 'MEN',
      categorySlug: 'men-tshirts',
      originalPrice: 2999,
      sellingPrice: 2299,
      discountPercent: 23,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
      ],
      variants: [
        { size: 'S', colorName: 'Obsidian Noir', colorHex: '#101010', stock: 25 },
        { size: 'M', colorName: 'Obsidian Noir', colorHex: '#101010', stock: 30 },
        { size: 'L', colorName: 'Obsidian Noir', colorHex: '#101010', stock: 25 },
        { size: 'XL', colorName: 'Obsidian Noir', colorHex: '#101010', stock: 15 },
        { size: 'M', colorName: 'Chalk White', colorHex: '#F4F4F4', stock: 20 },
      ],
    },
    {
      name: 'Handcrafted Italian Wool Overcoat',
      slug: 'handcrafted-italian-wool-overcoat',
      sku: 'MOD-MJK-003',
      description: 'Sculpted from double-faced virgin wool blend with horn buttons and silk-lined interior. An iconic winter layer of sartorial prestige.',
      details: '85% Virgin Wool, 15% Cashmere | Fully Silk Lined | Tailored Lapels',
      gender: 'MEN',
      categorySlug: 'men-jackets',
      originalPrice: 24999,
      sellingPrice: 19999,
      discountPercent: 20,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      images: [
        'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      ],
      variants: [
        { size: '38 (S)', colorName: 'Camel', colorHex: '#C19A6B', stock: 8 },
        { size: '40 (M)', colorName: 'Camel', colorHex: '#C19A6B', stock: 10 },
        { size: '42 (L)', colorName: 'Camel', colorHex: '#C19A6B', stock: 6 },
        { size: '40 (M)', colorName: 'Charcoal Grey', colorHex: '#36454F', stock: 5 },
      ],
    },
    {
      name: 'Pleated Raw Silk Kurta with Bundi Vest',
      slug: 'pleated-raw-silk-kurta-with-bundi-vest',
      sku: 'MOD-MET-004',
      description: 'Opulent raw Matka silk kurta adorned with subtle resham hand-embroidery, complemented by a tailored Nehru bundi vest.',
      details: 'Pure Matka Silk | Metallic Zari Accents | Concealed Placket | Heritage Collection',
      gender: 'MEN',
      categorySlug: 'men-ethnic',
      originalPrice: 14999,
      sellingPrice: 11999,
      discountPercent: 20,
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      ],
      variants: [
        { size: '38 (S)', colorName: 'Royal Emerald', colorHex: '#046307', stock: 10 },
        { size: '40 (M)', colorName: 'Royal Emerald', colorHex: '#046307', stock: 15 },
        { size: '42 (L)', colorName: 'Royal Emerald', colorHex: '#046307', stock: 12 },
        { size: '40 (M)', colorName: 'Champagne Gold', colorHex: '#F7E7CE', stock: 10 },
      ],
    },
    // Women's Products
    {
      name: 'Mulberry Silk Bias-Cut Column Gown',
      slug: 'mulberry-silk-bias-cut-column-gown',
      sku: 'MOD-WDR-005',
      description: 'Fluid 19-momme grade-6A Mulberry silk dress cut on the bias to drape gracefully over the contours of the body. Features an open cowl back.',
      details: '100% Grade-6A Mulberry Silk | Adjustable French Straps | Invisible Side Zipper',
      gender: 'WOMEN',
      categorySlug: 'women-dresses',
      originalPrice: 16999,
      sellingPrice: 13499,
      discountPercent: 21,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
      ],
      variants: [
        { size: 'XS', colorName: 'Champagne Pearl', colorHex: '#EDE6D6', stock: 8 },
        { size: 'S', colorName: 'Champagne Pearl', colorHex: '#EDE6D6', stock: 14 },
        { size: 'M', colorName: 'Champagne Pearl', colorHex: '#EDE6D6', stock: 16 },
        { size: 'L', colorName: 'Champagne Pearl', colorHex: '#EDE6D6', stock: 10 },
        { size: 'S', colorName: 'Bordeaux Red', colorHex: '#5C061B', stock: 12 },
      ],
    },
    {
      name: 'Handwoven Chanderi Zari Saree with Unstitched Blouse',
      slug: 'handwoven-chanderi-zari-saree',
      sku: 'MOD-WET-006',
      description: 'Authentic pure Chanderi silk cotton saree woven by master weavers in Madhya Pradesh, featuring intricate gold eknaliya motifs.',
      details: 'Pure Chanderi Silk Cotton | Real Zari Border | 6.5 Metres with Blouse Piece',
      gender: 'WOMEN',
      categorySlug: 'women-ethnic',
      originalPrice: 18999,
      sellingPrice: 14999,
      discountPercent: 21,
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1610030469668-935a8bc58ec7?auto=format&fit=crop&w=1000&q=80',
      ],
      variants: [
        { size: 'Free Size', colorName: 'Dusty Rose Gold', colorHex: '#DCAE96', stock: 20 },
        { size: 'Free Size', colorName: 'Peacock Teal', colorHex: '#005F73', stock: 15 },
      ],
    },
    {
      name: 'Tailored Linen Blazer & Flared Trouser Co-ord',
      slug: 'tailored-linen-blazer-flared-trouser-coord',
      sku: 'MOD-WCD-007',
      description: 'An impeccably tailored summer ensemble crafted from breathable Normandy flax linen. Features tortoiseshell buttons and deep flap pockets.',
      details: '100% European Flax Linen | Viscose Lining | High-waist Flare Cut',
      gender: 'WOMEN',
      categorySlug: 'women-coord-sets',
      originalPrice: 12999,
      sellingPrice: 9999,
      discountPercent: 23,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
      ],
      variants: [
        { size: 'XS', colorName: 'Ecru Sand', colorHex: '#C2B280', stock: 7 },
        { size: 'S', colorName: 'Ecru Sand', colorHex: '#C2B280', stock: 12 },
        { size: 'M', colorName: 'Ecru Sand', colorHex: '#C2B280', stock: 14 },
        { size: 'L', colorName: 'Ecru Sand', colorHex: '#C2B280', stock: 8 },
      ],
    },
    {
      name: 'Architectural Pleated Poplin Blouse',
      slug: 'architectural-pleated-poplin-blouse',
      sku: 'MOD-WTP-008',
      description: 'Dramatic balloon sleeves and micro-pleated front paneling create a sculptured, editorial profile in crisp organic cotton poplin.',
      details: '100% Organic Cotton Poplin | Concealed Back Zip | Mandarin Collar',
      gender: 'WOMEN',
      categorySlug: 'women-tops',
      originalPrice: 5999,
      sellingPrice: 4499,
      discountPercent: 25,
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: true,
      images: [
        'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
      ],
      variants: [
        { size: 'S', colorName: 'Optic White', colorHex: '#FFFFFF', stock: 15 },
        { size: 'M', colorName: 'Optic White', colorHex: '#FFFFFF', stock: 18 },
        { size: 'L', colorName: 'Optic White', colorHex: '#FFFFFF', stock: 12 },
        { size: 'S', colorName: 'Onyx Black', colorHex: '#1C1C1C', stock: 10 },
      ],
    },
  ];

  for (const item of productsData) {
    const categoryId = createdCategories[item.categorySlug];
    if (!categoryId) continue;

    const prod = await prisma.product.upsert({
      where: { sku: item.sku },
      update: {
        originalPrice: item.originalPrice,
        sellingPrice: item.sellingPrice,
        discountPercent: item.discountPercent,
        isFeatured: item.isFeatured,
        isNewArrival: item.isNewArrival,
        isBestSeller: item.isBestSeller,
      },
      create: {
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        description: item.description,
        details: item.details,
        gender: item.gender,
        categoryId,
        originalPrice: item.originalPrice,
        sellingPrice: item.sellingPrice,
        discountPercent: item.discountPercent,
        isFeatured: item.isFeatured,
        isNewArrival: item.isNewArrival,
        isBestSeller: item.isBestSeller,
        status: 'ACTIVE',
        images: {
          create: item.images.map((url, idx) => ({
            url,
            displayOrder: idx,
            isThumbnail: idx === 0,
            altText: `${item.name} view ${idx + 1}`,
          })),
        },
      },
    });

    // Create variants and inventory
    for (const v of item.variants) {
      const variantSku = `${item.sku}-${v.size.replace(/\s+/g, '')}-${v.colorName.replace(/\s+/g, '')}`;
      await prisma.productVariant.upsert({
        where: { sku: variantSku },
        update: {},
        create: {
          productId: prod.id,
          size: v.size,
          colorName: v.colorName,
          colorHex: v.colorHex,
          sku: variantSku,
          inventory: {
            create: {
              quantity: v.stock,
              lowStockThreshold: 5,
            },
          },
        },
      });
    }

    // Add an initial review
    await prisma.review.create({
      data: {
        productId: prod.id,
        userId: customer.id,
        rating: 5,
        title: 'Exceptional craftsmanship & immaculate drape',
        comment: 'The fabric quality exceeds international couture houses. Delivered in pristine luxury packaging within 48 hours to Mumbai.',
        isVerifiedPurchase: true,
        isApproved: true,
      },
    });
  }
  console.log('✓ Curated luxury products & variant inventories seeded');
  console.log('--- MODÉRA Database Seeding Complete ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

