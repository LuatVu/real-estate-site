import { MetadataRoute } from 'next'

// Generate sitemap for better SEO
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/posts?tab=BUY`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/posts?tab=RENT`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  // Popular cities for better SEO
  const popularCities = [
    'HaNoi', 'HoChiMinh', 'DaNang', 'HaiPhong', 'CanTho',
    'BienHoa', 'VungTau', 'NhaTrang', 'HuongGiang', 'BuonMaThuot'
  ]

  const cityRoutes = popularCities.flatMap(city => [
    {
      url: `${baseUrl}/posts?city=${city}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/posts?city=${city}&tab=BUY`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/posts?city=${city}&tab=RENT`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    },
  ])

  // Dynamic post routes
  let postRoutes: MetadataRoute.Sitemap = []
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/posts`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const result = await response.json()
      const posts = result.response?.content || []
      
      postRoutes = posts.map((post: any) => ({
        url: `${baseUrl}/post/${post.id}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
  }

  return [...staticRoutes, ...cityRoutes, ...postRoutes]
}