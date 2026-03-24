import Link from "next/link"
import styles from "./Footer.module.scss"

const columns = [
  {
    title: "Movies",
    links: [
      { label: "Recommended", href: "/movies?filter=popular" },
      { label: "In Cinema", href: "/movies?filter=now_playing" },
      { label: "Coming Soon", href: "/movies?filter=upcoming" },
    ],
  },
  {
    title: "Cinemas",
    links: [
      { label: "Skopje", href: "#" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Technology", href: "#" },
      { label: "Bonus Card Info", href: "#" },
      { label: "Family Film Club", href: "#" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { label: "Facebook", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "YouTube", href: "#" },
      { label: "TikTok", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Press", href: "#" },
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
]

const bottomLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Contact Us", href: "#" },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        {columns.map(col => (
          <div key={col.title} className={styles.column}>
            <h4 className={styles.columnTitle}>{col.title}</h4>
            <ul className={styles.linkList}>
              {col.links.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <span className={styles.copyright}>&copy; 2026 CINEMA MKD</span>
        <nav className={styles.bottomNav}>
          {bottomLinks.map(link => (
            <Link key={link.label} href={link.href} className={styles.bottomLink}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
