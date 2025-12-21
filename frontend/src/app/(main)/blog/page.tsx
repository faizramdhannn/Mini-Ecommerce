'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

// Dummy blog data
const blogPosts = [
  {
    id: 1,
    slug: 'tips-memilih-laptop-gaming-2024',
    title: '10 Tips Memilih Laptop Gaming Terbaik di 2024',
    excerpt: 'Panduan lengkap memilih laptop gaming yang sesuai dengan budget dan kebutuhan Anda. Pelajari spesifikasi yang wajib diperhatikan.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
    author: 'Admin Magadir',
    date: '2024-12-15',
    category: 'Tips & Tricks',
    readTime: '5 min'
  },
  {
    id: 2,
    slug: 'perbedaan-mechanical-keyboard',
    title: 'Perbedaan Switch Mechanical Keyboard: Red, Brown, Blue',
    excerpt: 'Bingung memilih switch mechanical keyboard? Artikel ini menjelaskan perbedaan masing-masing switch dan cocok untuk siapa saja.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    author: 'Tech Editor',
    date: '2024-12-10',
    category: 'Review',
    readTime: '7 min'
  },
  {
    id: 3,
    slug: 'smartphone-flagship-vs-midrange',
    title: 'Smartphone Flagship vs Mid-range: Mana yang Lebih Worth It?',
    excerpt: 'Analisis lengkap perbandingan smartphone flagship dan mid-range dari segi performa, kamera, dan value for money.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    author: 'Mobile Expert',
    date: '2024-12-05',
    category: 'Comparison',
    readTime: '6 min'
  },
  {
    id: 4,
    slug: 'merawat-laptop-agar-awet',
    title: 'Cara Merawat Laptop Agar Awet dan Tahan Lama',
    excerpt: 'Tips praktis merawat laptop mulai dari pembersihan, charging yang benar, hingga software maintenance.',
    image: 'https://images.unsplash.com/photo-1587202372775-98927d7dbd06?w=800',
    author: 'Admin Magadir',
    date: '2024-11-28',
    category: 'Tips & Tricks',
    readTime: '4 min'
  },
  {
    id: 5,
    slug: 'tren-gadget-2025',
    title: 'Tren Gadget yang Akan Booming di 2025',
    excerpt: 'Prediksi gadget dan teknologi yang akan mendominasi pasar tahun 2025. Dari AI hingga foldable devices.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    author: 'Tech Editor',
    date: '2024-11-20',
    category: 'News',
    readTime: '8 min'
  },
  {
    id: 6,
    slug: 'headphone-noise-cancelling-terbaik',
    title: 'Review Headphone Noise Cancelling Terbaik 2024',
    excerpt: 'Perbandingan mendalam headphone noise cancelling dari berbagai brand: Sony, Bose, Apple, dan lainnya.',
    image: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=800',
    author: 'Audio Specialist',
    date: '2024-11-15',
    category: 'Review',
    readTime: '10 min'
  }
];

const categories = ['All', 'Tips & Tricks', 'Review', 'Comparison', 'News'];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Magadir Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tips, review, dan berita terbaru seputar teknologi dan gadget
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                category === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.date).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                  <span className="text-gray-400">{post.readTime}</span>
                </div>

                {/* Read More */}
                <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12 space-x-2">
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100">2</button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100">3</button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}