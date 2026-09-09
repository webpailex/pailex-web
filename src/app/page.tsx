import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/sections/PageHero";
import BrandSlider from "@/components/sections/BrandSlider";
import FAQAccordion from "@/components/sections/FAQAccordion";
import SectionDots from "@/components/sections/SectionDots";
import { getPage, getPosts, FALLBACK_IMAGE, type HomeCollections, type MediaItem, type CardBackground, type SectorItem } from "@/lib/api";
import { withHighlight } from "@/lib/highlight";
import { formatDate } from "@/lib/format";
import { pageMetadata, SchemaScript } from "@/lib/seo";
import { sectionStyle, isDotted, cardStyle, titleSize } from "@/lib/sectionStyle";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage<HomeCollections>("home");
  return pageMetadata(page.seo, "/", page.hero.video_poster ?? page.hero.image ?? null);
}

export default async function Home() {
  const [page, posts] = await Promise.all([getPage<HomeCollections>("home"), getPosts()]);
  if (page.status !== "published") notFound();
  const { texts, collections, sections } = page;
  const latestPosts = posts.slice(0, 3);

  const solutionsCards = sections.solutions_cards;
  const whyChoose = sections.why_choose;
  const ctaBanner = sections.cta_banner;
  const brands = sections.brands;
  const sectors = sections.sectors;
  const blog = sections.blog;
  const faq = sections.faq;

  const whyStyle = sectionStyle(whyChoose.background);
  const ctaStyle = sectionStyle(ctaBanner.background);
  const sectorsStyle = sectionStyle(sectors.background);
  const blogStyle = sectionStyle(blog.background);

  // Más de 5 tarjetas: se acomodan en dos filas (arriba una más, si son impares)
  // en vez de dejar que la quinta columna se corte a la mitad al envolver.
  const sectorTopCount = Math.ceil(collections.sectors.length / 2);
  const sectorsTop = collections.sectors.slice(0, sectorTopCount);
  const sectorsBottom = collections.sectors.slice(sectorTopCount);

  return (
    <div className="bg-white">
      <SchemaScript schema={page.seo.schema} />
      <PageHero hero={page.hero} />

      {/* Tarjetas de Soluciones */}
      <section className={`py-32 relative overflow-hidden ${sectionStyle(solutionsCards.background).section}`}>
        {isDotted(solutionsCards.background) && <SectionDots />}
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="max-w-2xl">
              <h2
                className={`font-title font-bold uppercase tracking-tight ${titleSize(solutionsCards.title_size, "text-4xl md:text-5xl").className} ${sectionStyle(solutionsCards.background).heading}`}
                style={titleSize(solutionsCards.title_size, "text-4xl md:text-5xl").style}
              >
                {solutionsCards.title}
              </h2>
              <div className={`w-20 h-1.5 mt-4 ${sectionStyle(solutionsCards.background).accentLine}`} />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {collections.solution_cards.map((card) => (
              <SolutionCard
                key={card.title}
                title={card.title}
                desc={card.description}
                image={card.image}
                href={card.href}
                background={card.background}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ¿Por qué elegir a Pailex? */}
      <section className={`py-28 overflow-hidden relative ${whyStyle.section}`}>
        {isDotted(whyChoose.background) && <SectionDots />}

        <div className="max-w-7xl mx-auto px-6 text-center mb-20 relative z-10">
          <h2
            className={`font-title font-bold uppercase tracking-tight ${titleSize(whyChoose.title_size, "text-4xl md:text-5xl").className} ${whyStyle.heading}`}
            style={titleSize(whyChoose.title_size, "text-4xl md:text-5xl").style}
          >
            {withHighlight(whyChoose.title ?? "", whyChoose.title_highlight)}
          </h2>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 relative z-10">
          {collections.features.map((feature, i) => (
            <FeatureItem
              key={feature.title}
              title={feature.title}
              desc={feature.description}
              isFirst={i === 0}
              light={whyChoose.background === "white" || whyChoose.background === "gray"}
            />
          ))}
        </div>
      </section>

      {/* Banner CTA Central */}
      <section className={`py-24 relative overflow-hidden ${ctaStyle.section}`}>
        {isDotted(ctaBanner.background) && <SectionDots />}
        {/* Motivo geométrico de marca: triángulos a 45° tipo molinete */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-support/10 [clip-path:polygon(100%_0,0_0,100%_100%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-support/10 [clip-path:polygon(0_100%,0_0,100%_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2
            className={`font-title font-bold mb-12 max-w-5xl mx-auto leading-tight uppercase tracking-tighter ${titleSize(ctaBanner.title_size, "text-3xl md:text-5xl").className} ${ctaStyle.heading}`}
            style={titleSize(ctaBanner.title_size, "text-3xl md:text-5xl").style}
          >
            {withHighlight(ctaBanner.title ?? "", ctaBanner.title_highlight)}
          </h2>
          <a href="#cotizar" className="inline-block bg-accent text-primary px-10 py-5 font-title font-bold text-lg hover:bg-white transition-all uppercase tracking-widest clip-notch-br-sm">
            {texts.cta_label}
          </a>
        </div>
      </section>

      <BrandSlider
        title={brands.title ?? ""}
        titleSize={brands.title_size}
        brands={collections.brands}
        background={brands.background}
      />

      {/* Sectores que respaldamos */}
      <section className={`py-32 border-b border-support/10 relative overflow-hidden ${sectorsStyle.section}`}>
        {isDotted(sectors.background) && <SectionDots />}
        <div className="max-w-7xl mx-auto px-6 text-center mb-16 relative z-10">
          <h2
            className={`font-title font-bold uppercase tracking-tight ${titleSize(sectors.title_size, "text-3xl md:text-4xl").className} ${sectorsStyle.heading}`}
            style={titleSize(sectors.title_size, "text-3xl md:text-4xl").style}
          >
            {sectors.title}
          </h2>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {collections.sectors.length <= 5 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {collections.sectors.map((sector) => (
                <SectorCard key={sector.name} sector={sector} />
              ))}
            </div>
          ) : (
            <>
              {/* Móvil / tablet: se acomodan solas, sin dividir en filas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6">
                {collections.sectors.map((sector) => (
                  <SectorCard key={sector.name} sector={sector} />
                ))}
              </div>

              {/* Escritorio: dos filas (la de abajo centrada si sobran menos) */}
              <div className="hidden lg:block space-y-6">
                <div
                  className="grid gap-6"
                  style={{ gridTemplateColumns: `repeat(${sectorsTop.length}, minmax(0, 1fr))` }}
                >
                  {sectorsTop.map((sector) => (
                    <SectorCard key={sector.name} sector={sector} />
                  ))}
                </div>
                <div className="flex justify-center gap-6">
                  {sectorsBottom.map((sector) => (
                    <div
                      key={sector.name}
                      style={{ width: `calc((100% - ${(sectorsTop.length - 1) * 24}px) / ${sectorsTop.length})` }}
                    >
                      <SectorCard sector={sector} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Blog: últimas notas publicadas en el CMS */}
      {latestPosts.length > 0 && (
        <section className={`py-32 relative overflow-hidden ${blogStyle.section}`}>
          {isDotted(blog.background) && <SectionDots />}
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="border-t-4 border-support pt-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2
                className={`font-title font-bold uppercase tracking-tight ${titleSize(blog.title_size, "text-4xl").className} ${blogStyle.heading}`}
                style={titleSize(blog.title_size, "text-4xl").style}
              >
                {blog.title}
              </h2>
              <Link
                href="/blog"
                className="relative overflow-hidden text-primary font-bold uppercase text-xs tracking-[0.2em] inline-flex items-center self-start md:self-auto group/all"
              >
                <span className="relative z-10 group-hover/all:text-support transition-colors duration-300">Ver todas las notas</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-support group-hover/all:bg-accent origin-left transition-all duration-300" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {latestPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <div className="bg-white border border-support/10 h-64 mb-6 relative overflow-hidden">
                    <Image
                      src={post.image?.url ?? FALLBACK_IMAGE}
                      alt={post.image?.alt ?? post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/25 transition-colors duration-500" />
                    <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-support/40" />
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-support/40" />
                  </div>
                  <time
                    dateTime={post.published_at ?? undefined}
                    className="font-title text-support text-xs uppercase tracking-[0.2em]"
                  >
                    {formatDate(post.published_at)}
                  </time>
                  <h3 className="font-title text-xl font-bold text-primary group-hover:text-support transition-colors uppercase mt-2 leading-tight">
                    {post.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQAccordion title={faq.title ?? ""} titleSize={faq.title_size} faqs={collections.faqs} background={faq.background} />
    </div>
  );
}

function SectorCard({ sector }: { sector: SectorItem }) {
  return (
    <div className="relative h-72 group overflow-hidden clip-notch-br-sm cursor-default">
      <Image
        src={sector.image?.url ?? FALLBACK_IMAGE}
        alt={sector.image?.alt ?? sector.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent transition-colors duration-500 group-hover:from-primary" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="w-6 h-[2px] bg-accent mb-3 transition-all duration-500 group-hover:w-10" />
        <p className="font-title font-bold text-sm uppercase text-white tracking-widest leading-snug">{sector.name}</p>
      </div>
    </div>
  );
}

function SolutionCard({
  title, desc, image, href, background,
}: { title: string, desc: string, image: MediaItem | null, href: string, background: CardBackground }) {
  const style = cardStyle(background);
  return (
    <div className={`border group transition-all duration-500 shadow-sm relative overflow-hidden clip-notch-br ${style.base} ${style.border} ${style.hover}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-support group-hover:bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 z-10" />
      <div className="relative h-56 overflow-hidden">
        <Image
          src={image?.url ?? FALLBACK_IMAGE}
          alt={image?.alt ?? title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-primary/15 group-hover:bg-primary/40 transition-colors duration-500" />
      </div>
      <div className="p-10">
        <h3 className={`font-title text-3xl font-bold mb-6 transition-colors uppercase tracking-tight leading-none group-hover:text-accent ${style.heading}`}>{title}</h3>
        <p className={`mb-10 font-body transition-colors leading-relaxed text-lg ${style.body}`}>{desc}</p>
        <Link href={href} className="relative overflow-hidden group/btn text-primary font-bold uppercase text-xs tracking-[0.2em] inline-flex items-center">
          <span className="relative z-10 group-hover:text-accent transition-colors duration-300">Ver más</span>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-support group-hover:bg-accent transform origin-left transition-all duration-300" />
        </Link>
      </div>
    </div>
  );
}

function FeatureItem({ title, desc, isFirst, light }: { title: string, desc: string, isFirst?: boolean, light?: boolean }) {
  return (
    <div
      className={`p-10 space-y-6 group transition-colors ${isFirst ? "md:border-l-0" : "md:border-l"} ${
        light ? "border-support/40 hover:bg-black/[0.03]" : "border-support/25 hover:bg-white/5"
      }`}
    >
      <div className={`w-8 h-[3px] ${light ? "bg-support" : "bg-accent"}`} />
      <h4 className={`font-title font-bold text-2xl uppercase tracking-wider leading-tight ${light ? "text-primary" : "text-white"}`}>{title}</h4>
      <p className={`text-base font-body leading-relaxed ${light ? "text-industrial-gray" : "text-support"}`}>{desc}</p>
    </div>
  );
}
