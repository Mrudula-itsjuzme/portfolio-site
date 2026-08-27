import { forwardRef, useState, useEffect } from "react";
import ArchitectureDiagram from "./ArchitectureDiagram";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ReadmeRenderer({ project, page }) {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!project.repoName) {
      setMarkdown("*No repository name provided.*");
      setLoading(false);
      return;
    }
    
    const fetchReadme = async () => {
      try {
        let res = await fetch(`https://raw.githubusercontent.com/${project.repoName}/main/README.md`);
        if (!res.ok) {
          res = await fetch(`https://raw.githubusercontent.com/${project.repoName}/master/README.md`);
        }
        if (res.ok) {
          // Replace relative image paths with absolute github raw paths so images load!
          let text = await res.text();
          const baseUrl = `https://raw.githubusercontent.com/${project.repoName}/main/`;
          text = text.replace(/!\[([^\]]*)\]\((?!http)(.*?)\)/g, `![$1](${baseUrl}$2)`);
          setMarkdown(text);
        } else {
          setMarkdown("*README not found for this repository.*");
        }
      } catch (e) {
        setMarkdown("*Failed to load README.*");
      }
      setLoading(false);
    };
    
    fetchReadme();
  }, [project.repoName]);

  return (
    <article className="page-surface markdown-surface" style={{ flex: 1, overflowY: "auto" }}>
      <h3>{page.title}</h3>
      {loading ? (
        <p style={{ textAlign: "center", fontStyle: "italic", opacity: 0.7 }}>Loading documentation...</p>
      ) : (
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </div>
      )}
    </article>
  );
}

function PageBody({ project, page }) {
  if (page.kind === "cover") {
    return (
      <article className="page-surface cover-surface">
        <p className="cover-kicker">Portfolio Manuscript</p>
        <h2>{page.title}</h2>
        <p>{page.subtitle}</p>
        {page.image ? (
          <figure className="page-figure">
            <img src={page.image} alt={`${page.title} cover visual`} loading="lazy" />
          </figure>
        ) : null}
        <div className="cover-meta">
          <span>{page.author}</span>
          <span>{page.year}</span>
        </div>
        <p className="archive-meta">{page.archiveCode} • {page.shelfMark}</p>
      </article>
    );
  }

  if (page.kind === "titleplate") {
    return (
      <article className="page-surface titleplate-surface">
        <p className="cover-kicker">Archive Plate</p>
        <h3>{page.title}</h3>
        <p>{page.subtitle}</p>
        <div className="seal-row">
          <span>{page.archiveCode}</span>
          <span>{page.shelfMark}</span>
          <span>{page.monogram}</span>
        </div>
        <p>{page.summary}</p>
      </article>
    );
  }

  if (page.kind === "overview") {
    return (
      <article className="page-surface">
        <h3>{page.title}</h3>
        <dl className="manuscript-grid">
          <div>
            <dt>Problem</dt>
            <dd>{page.problem || page.bullets?.[0] || "Problem statement unavailable."}</dd>
          </div>
          <div>
            <dt>Idea</dt>
            <dd>{page.idea || page.bullets?.[1] || "Approach details unavailable."}</dd>
          </div>
          <div>
            <dt>Goal</dt>
            <dd>{page.goal || page.bullets?.[2] || "Outcome target unavailable."}</dd>
          </div>
        </dl>
      </article>
    );
  }

  if (page.kind === "architecture") {
    return (
      <article className="page-surface">
        <h3>{page.title}</h3>
        {page.image ? (
          <figure className="page-figure compact">
            <img src={page.image} alt={`${page.title} visual`} loading="lazy" />
          </figure>
        ) : (
          <ArchitectureDiagram steps={page.diagram || []} />
        )}
        <p className="arch-caption">{page.text}</p>
      </article>
    );
  }

  if (page.kind === "readme") {
    return <ReadmeRenderer project={project} page={page} />;
  }

  if (page.kind === "essay") {
    return (
      <article className="page-surface essay-surface">
        <h3>{page.title}</h3>
        {(page.paragraphs || []).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {page.image ? (
          <figure className="page-figure compact">
            <img src={page.image} alt={`${page.title} illustration`} loading="lazy" />
            {page.caption ? <figcaption>{page.caption}</figcaption> : null}
          </figure>
        ) : null}
      </article>
    );
  }

  if (page.kind === "matrix") {
    return (
      <article className="page-surface">
        <h3>{page.title}</h3>
        <div className="matrix-wrap">
          <table className="manuscript-table">
            <thead>
              <tr>
                {(page.columns || []).map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(page.rows || []).map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    );
  }

  if (page.kind === "workflow") {
    return (
      <article className="page-surface">
        <h3>{page.title}</h3>
        <ol className="pipeline-list">
          {(page.steps || []).map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </article>
    );
  }

  if (page.kind === "stack") {
    return (
      <article className="page-surface">
        <h3>{page.title}</h3>
        <ul className="stack-list">
          {(page.technologies || []).map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </article>
    );
  }

  if (page.kind === "checklist") {
    return (
      <article className="page-surface">
        <h3>{page.title}</h3>
        <ul className="checklist">
          {(page.checks || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    );
  }

  if (page.kind === "metrics") {
    return (
      <article className="page-surface">
        <h3>{page.title}</h3>
        <div className="metric-grid">
          {(page.metrics || []).map((metric) => (
            <div key={metric.label} className="metric-card">
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>
        {page.image ? (
          <figure className="page-figure compact">
            <img src={page.image} alt={`${page.title} chart`} loading="lazy" />
          </figure>
        ) : null}
      </article>
    );
  }

  if (page.kind === "resources") {
    return (
      <article className="page-surface">
        <h3>{page.title}</h3>
        <ul className="resource-list">
          {(page.links || []).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    );
  }

  if (page.kind === "gallery") {
    return (
      <article className="page-surface">
        <h3>{page.title}</h3>
        <div className="gallery-grid">
          {(page.images || []).map((item) => (
            <figure key={item.src} className="page-figure compact">
              <img src={item.src} alt={item.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </article>
    );
  }

  if (page.kind === "highlights") {
    return (
      <article className="page-surface highlights-surface">
        <h3>{page.title}</h3>
        <div className="highlights-grid">
          {(page.items || []).map((item) => (
            <div key={item} className="highlight-item">
              <span className="highlight-icon">✦</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </article>
    );
  }

  if (page.kind === "metrics") {
    return (
      <article className="page-surface metrics-surface">
        <h3>{page.title}</h3>
        <div className="metrics-grid">
          {(page.metrics || []).map((m) => (
            <div key={m.label} className="metric-item">
              <div className="metric-value">{m.value}</div>
              <div className="metric-label">{m.label}</div>
            </div>
          ))}
        </div>
      </article>
    );
  }

  if (page.kind === "github") {
    return (
      <article className="page-surface github-surface">
        <h3>{page.title}</h3>
        <p>Final references and source material for this volume.</p>
        <a className="code-button" href={project.githubUrl} target="_blank" rel="noreferrer">
          {page.buttonText}
        </a>
        <a className="demo-link" href={project.demoUrl} target="_blank" rel="noreferrer">
          Live Demo
        </a>
      </article>
    );
  }

  return (
    <article className="page-surface">
      <h3>{page.title}</h3>
      <ul>
        {(page.bullets || []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

const Page = forwardRef(function Page({ project, page, index, total }, ref) {
  const sideClass = index % 2 === 0 ? "recto" : "verso";

  return (
    <div className={`paper-page ${sideClass}`} ref={ref}>
      <div className="page-inner-frame">
        <div className="running-head" aria-hidden="true">
          <span>{project.spineTitle}</span>
          <span>{page.title}</span>
        </div>
        <PageBody project={project} page={page} />
        <p className="folio">Page {index + 1} / {total}</p>
      </div>
    </div>
  );
});

export default Page;
