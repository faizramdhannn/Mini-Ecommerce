'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Tag, Clock } from 'lucide-react';

// Dummy data for blog detail
const blogPost = {
  id: 1,
  slug: 'tips-memilih-laptop-gaming-2024',
  title: '10 Tips Memilih Laptop Gaming Terbaik di 2024',
  image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200',
  author: 'Admin Magadir',
  date: '2024-12-15',
  category: 'Tips & Tricks',
  readTime: '5 min',
  tags: ['Laptop', 'Gaming', 'Tips', 'Hardware'],
  content: `
    <p>Memilih laptop gaming yang tepat bisa menjadi tantangan tersendiri, terutama dengan banyaknya pilihan di pasaran. Artikel ini akan membantu Anda membuat keputusan yang tepat.</p>

    <h2>1. Tentukan Budget</h2>
    <p>Langkah pertama adalah menentukan budget. Laptop gaming tersedia di berbagai range harga mulai dari 10 juta hingga puluhan juta rupiah. Pastikan Anda tahu berapa yang bisa Anda keluarkan.</p>

    <h2>2. Prosesor (CPU)</h2>
    <p>Untuk gaming, minimal gunakan Intel Core i5 generasi terbaru atau AMD Ryzen 5. Untuk performa optimal, pilih i7 atau Ryzen 7.</p>

    <h2>3. Kartu Grafis (GPU)</h2>
    <p>Ini adalah komponen paling penting. Minimal RTX 3050 untuk gaming 1080p. Untuk 1440p atau ray tracing, pertimbangkan RTX 4060 atau lebih tinggi.</p>

    <h2>4. RAM</h2>
    <p>16GB adalah standar minimum untuk gaming modern. 32GB lebih baik jika budget memungkinkan.</p>

    <h2>5. Storage</h2>
    <p>SSD NVMe minimal 512GB. Pertimbangkan 1TB jika Anda bermain banyak game AAA yang ukurannya besar.</p>

    <h2>6. Display</h2>
    <p>Minimal 144Hz untuk pengalaman gaming yang smooth. Panel IPS lebih baik untuk viewing angle yang luas.</p>

    <h2>7. Cooling System</h2>
    <p>Perhatikan sistem pendingin. Laptop gaming yang baik memiliki cooling system yang efisien untuk mencegah thermal throttling.</p>

    <h2>8. Build Quality</h2>
    <p>Cek material dan build quality. Hindari plastik yang terlalu flimsy. Metal chassis lebih awet tapi lebih berat.</p>

    <h2>9. Battery Life</h2>
    <p>Laptop gaming jarang bertahan lama saat gaming tanpa charger. Namun, untuk productivity, cari yang minimal 5-6 jam.</p>

    <h2>10. Brand dan After Sales</h2>
    <p>Pilih brand yang memiliki service center di Indonesia. Perhatikan juga review garansi dan customer service mereka.</p>

    <h2>Kesimpulan</h2>
    <p>Memilih laptop gaming memang memerlukan riset. Dengan memperhatikan 10 tips di atas, Anda akan lebih mudah menemukan laptop gaming yang sesuai kebutuhan dan budget.</p>
  `
};

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-96">
            <Image
              src={blogPost.image}
              alt={blogPost.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Category */}
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {blogPost.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {blogPost.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {blogPost.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(blogPost.date).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {blogPost.readTime}
              </div>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />

            {/* Tags */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="w-5 h-5 text-gray-400" />
                {blogPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Dummy related articles */}
            <Link href="/blog/perbedaan-mechanical-keyboard" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40">
                  <Image
                    src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600"
                    alt="Related Article"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
                    Perbedaan Switch Mechanical Keyboard
                  </h3>
                </div>
              </div>
            </Link>

            <Link href="/blog/smartphone-flagship-vs-midrange" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40">
                  <Image
                    src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
                    alt="Related Article"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
                    Smartphone Flagship vs Mid-range
                  </h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}