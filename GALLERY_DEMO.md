# Anniversary Gallery Demo

This document provides instructions for running and using the Anniversary Gallery component.

## 🚀 Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the demo page:**
   Navigate to `http://localhost:3000/gallery-demo` in your browser

## 📁 Files Created

- `components/anniversary-gallery.tsx` - Main gallery component
- `app/gallery-demo/page.tsx` - Demo route page
- `public/images/` - Directory for gallery images

## 🎨 Gallery Features

The component showcases three distinct gallery concepts:

### 1. Journey Through Time (Masonry Grid)
- Responsive masonry layout
- Hover effects with captions
- Smooth scale transitions

### 2. Moments of Celebration (Grid + Lightbox)
- Traditional grid layout
- Click to open lightbox view
- Full-screen image viewing

### 3. Memories Carousel (Hero Slider)
- Auto-scrolling carousel
- Continuous animation
- Gradient background overlay

## 🖼️ Images

The component currently uses existing images from the public folder:
- `/binh-trieu-old.webp`
- `/sinh-vien-tot-nghiep.webp`
- `/q4-old.webp`
- `/long-phuoc.webp`
- `/binh-trieu-new.webp`
- `/q4-new.webp`

### To Use Custom Images:

1. Add your images to `public/images/` directory
2. Name them `1.jpg`, `2.jpg`, `3.jpg`, etc.
3. Update the `images` array in `components/anniversary-gallery.tsx`:

```typescript
const images = [
  { src: "/images/1.jpg", caption: "Your caption here" },
  { src: "/images/2.jpg", caption: "Your caption here" },
  // ... add more
];
```

## 🛠️ Customization

### Change Animation Speed
In the carousel section, modify the `duration` value:
```typescript
transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
```

### Adjust Grid Layout
Modify the grid columns in the masonry section:
```typescript
className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4"
```

### Update Colors
Change the carousel background gradient:
```typescript
className="bg-gradient-to-b from-blue-900 to-blue-700"
```

## 📱 Responsive Design

The gallery is fully responsive with breakpoints:
- **Mobile**: 1 column masonry, 2 column grid
- **Tablet**: 2 column masonry, 3 column grid
- **Desktop**: 3 column masonry, 3 column grid

## 🔧 Dependencies

This component uses:
- `react` - Core functionality
- `framer-motion` - Animations
- `tailwindcss` - Styling

All dependencies are already installed in the project.

## 💡 Usage in Other Pages

To use this component elsewhere in your app:

```typescript
import AnniversaryGallery from "@/components/anniversary-gallery";

export default function YourPage() {
  return (
    <div>
      <AnniversaryGallery />
    </div>
  );
}
```

## 🎯 Accessibility Notes

- All images have alt text via captions
- Lightbox can be closed by clicking anywhere
- Keyboard navigation support is recommended for future enhancement

## 📝 Future Enhancements

Consider adding:
- Lazy loading for images
- Keyboard navigation (ESC to close lightbox)
- Image filtering/categories
- Smooth scroll to sections
- Download image feature
- Share functionality

## 🐛 Troubleshooting

**Images not showing?**
- Check that image paths are correct
- Verify images exist in the public folder
- Check browser console for 404 errors

**Animation not smooth?**
- Ensure framer-motion is properly installed
- Check for conflicting CSS transitions
- Verify GPU acceleration is enabled

**Layout issues?**
- Clear browser cache
- Restart development server
- Check Tailwind CSS is properly configured

## 📞 Support

For issues or questions, refer to:
- Next.js documentation: https://nextjs.org/docs
- Framer Motion docs: https://www.framer.com/motion/
- Tailwind CSS docs: https://tailwindcss.com/docs