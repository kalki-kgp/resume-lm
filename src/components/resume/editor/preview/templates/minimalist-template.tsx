'use client';

import { Resume } from "@/lib/types";
import { Document as PDFDocument, Page as PDFPage, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { memo, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';

// Minimalist template with ultra-clean design
const baseStyles = {
  link: {
    color: '#000000',
    textDecoration: 'none',
    borderBottom: '0.5pt solid #000000',
  },
  bulletSeparator: {
    color: '#999999',
    marginHorizontal: 3,
  },
} as const;

const textProcessingCache = new Map<string, ReactNode[]>();

function useTextProcessor() {
  const processText = useCallback((text: string, ignoreMarkdown = false) => {
    const cacheKey = `${text}-${ignoreMarkdown}`;
    if (textProcessingCache.has(cacheKey)) {
      return textProcessingCache.get(cacheKey);
    }

    if (ignoreMarkdown) {
      const content = text.match(/\*\*(.*?)\*\*/)?.[1] || text;
      const processed = [<Text key={0}>{content}</Text>];
      textProcessingCache.set(cacheKey, processed);
      return processed;
    }

    const parts = text.split(/(\*\*.*?\*\*)/g);
    const processed = parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <Text key={index} style={{ fontFamily: 'Helvetica-Bold' }}>{part.slice(2, -2)}</Text>;
      }
      return <Text key={index}>{part}</Text>;
    });

    textProcessingCache.set(cacheKey, processed);
    return processed;
  }, []);

  return processText;
}

const HeaderSection = memo(function HeaderSection({
  resume,
  styles
}: {
  resume: Resume;
  styles: ReturnType<typeof createMinimalistStyles>;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.name}>{resume.first_name} {resume.last_name}</Text>
      <View style={styles.contactInfo}>
        {resume.email && (
          <>
            <Text>{resume.email}</Text>
            {(resume.phone_number || resume.location || resume.website || resume.linkedin_url || resume.github_url) && (
              <Text style={styles.bulletSeparator}>|</Text>
            )}
          </>
        )}
        {resume.phone_number && (
          <>
            <Text>{resume.phone_number}</Text>
            {(resume.location || resume.website || resume.linkedin_url || resume.github_url) && (
              <Text style={styles.bulletSeparator}>|</Text>
            )}
          </>
        )}
        {resume.location && (
          <>
            <Text>{resume.location}</Text>
            {(resume.website || resume.linkedin_url || resume.github_url) && (
              <Text style={styles.bulletSeparator}>|</Text>
            )}
          </>
        )}
        {resume.website && (
          <>
            <Link src={resume.website.startsWith('http') ? resume.website : `https://${resume.website}`}>
              <Text style={styles.link}>{resume.website}</Text>
            </Link>
            {(resume.linkedin_url || resume.github_url) && (
              <Text style={styles.bulletSeparator}>|</Text>
            )}
          </>
        )}
        {resume.linkedin_url && (
          <>
            <Link src={resume.linkedin_url.startsWith('http') ? resume.linkedin_url : `https://${resume.linkedin_url}`}>
              <Text style={styles.link}>LinkedIn</Text>
            </Link>
            {resume.github_url && <Text style={styles.bulletSeparator}>|</Text>}
          </>
        )}
        {resume.github_url && (
          <Link src={resume.github_url.startsWith('http') ? resume.github_url : `https://${resume.github_url}`}>
            <Text style={styles.link}>GitHub</Text>
          </Link>
        )}
      </View>
    </View>
  );
});

const SkillsSection = memo(function SkillsSection({
  skills,
  styles
}: {
  skills: Resume['skills'];
  styles: ReturnType<typeof createMinimalistStyles>;
}) {
  if (!skills?.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Skills</Text>
      <View style={styles.skillsContent}>
        {skills.map((skillCategory, index) => (
          <View key={index} style={styles.skillCategory}>
            <Text style={styles.skillCategoryTitle}>{skillCategory.category}</Text>
            <Text style={styles.skillItem}>{skillCategory.items.join(' · ')}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const ExperienceSection = memo(function ExperienceSection({
  experiences,
  styles
}: {
  experiences: Resume['work_experience'];
  styles: ReturnType<typeof createMinimalistStyles>;
}) {
  const processText = useTextProcessor();
  if (!experiences?.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>
      {experiences.map((experience, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{processText(experience.position, true)}</Text>
            <Text style={styles.dateText}>{experience.date}</Text>
          </View>
          <View style={styles.itemSubheader}>
            <Text style={styles.itemSubtitle}>{processText(experience.company, true)}</Text>
            {experience.location && (
              <>
                <Text style={styles.bulletSeparator}>·</Text>
                <Text style={styles.locationText}>{experience.location}</Text>
              </>
            )}
          </View>
          {experience.description.map((bullet, bulletIndex) => (
            <View key={bulletIndex} style={styles.bulletPoint}>
              <Text style={styles.bulletDot}>–</Text>
              <View style={styles.bulletText}>
                <Text style={styles.bulletTextContent}>
                  {processText(bullet)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
});

const ProjectsSection = memo(function ProjectsSection({
  projects,
  styles
}: {
  projects: Resume['projects'];
  styles: ReturnType<typeof createMinimalistStyles>;
}) {
  const processText = useTextProcessor();
  if (!projects?.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>
      {projects.map((project, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{processText(project.name, true)}</Text>
            {project.date && <Text style={styles.dateText}>{project.date}</Text>}
          </View>
          {project.technologies && (
            <Text style={styles.technologies}>{project.technologies.map(tech => tech.replace(/\*\*/g, '')).join(' · ')}</Text>
          )}
          {project.description.map((bullet, bulletIndex) => (
            <View key={bulletIndex} style={styles.bulletPoint}>
              <Text style={styles.bulletDot}>–</Text>
              <View style={styles.bulletText}>
                <Text style={styles.bulletTextContent}>
                  {processText(bullet)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
});

const EducationSection = memo(function EducationSection({
  education,
  styles
}: {
  education: Resume['education'];
  styles: ReturnType<typeof createMinimalistStyles>;
}) {
  const processText = useTextProcessor();
  if (!education?.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {education.map((edu, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{processText(edu.school, true)}</Text>
            <Text style={styles.dateText}>{edu.date}</Text>
          </View>
          <Text style={styles.itemSubtitle}>{processText(`${edu.degree} ${edu.field}`)}</Text>
          {edu.achievements && edu.achievements.map((achievement, bulletIndex) => (
            <View key={bulletIndex} style={styles.bulletPoint}>
              <Text style={styles.bulletDot}>–</Text>
              <View style={styles.bulletText}>
                {processText(achievement)}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
});

function createMinimalistStyles(settings: Resume['document_settings'] = {
  document_font_size: 10,
  document_line_height: 1.6,
  document_margin_vertical: 50,
  document_margin_horizontal: 50,
  header_name_size: 26,
  header_name_bottom_spacing: 8,
  skills_margin_top: 0,
  skills_margin_bottom: 0,
  skills_margin_horizontal: 0,
  skills_item_spacing: 3,
  experience_margin_top: 0,
  experience_margin_bottom: 0,
  experience_margin_horizontal: 0,
  experience_item_spacing: 10,
  projects_margin_top: 0,
  projects_margin_bottom: 0,
  projects_margin_horizontal: 0,
  projects_item_spacing: 10,
  education_margin_top: 0,
  education_margin_bottom: 0,
  education_margin_horizontal: 0,
  education_item_spacing: 10,
  footer_width: 80,
}) {
  const fontSize = settings.document_font_size || 10;

  return StyleSheet.create({
    ...baseStyles,
    page: {
      paddingTop: settings.document_margin_vertical || 50,
      paddingBottom: settings.document_margin_vertical || 50,
      paddingLeft: settings.document_margin_horizontal || 50,
      paddingRight: settings.document_margin_horizontal || 50,
      fontFamily: 'Helvetica',
      color: '#000000',
      fontSize: fontSize,
      lineHeight: settings.document_line_height || 1.6,
    },
    header: {
      marginBottom: 24,
      borderBottom: '0.5pt solid #000000',
      paddingBottom: 16,
    },
    name: {
      fontSize: settings.header_name_size || 26,
      fontFamily: 'Helvetica-Bold',
      color: '#000000',
      marginBottom: settings.header_name_bottom_spacing || 8,
      letterSpacing: 2,
    },
    contactInfo: {
      fontSize: fontSize - 1,
      color: '#333333',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 2,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: fontSize + 1,
      fontFamily: 'Helvetica-Bold',
      color: '#000000',
      marginBottom: 10,
      letterSpacing: 1,
    },
    skillsContent: {
      flexDirection: 'column',
      gap: settings.skills_item_spacing || 3,
    },
    skillCategory: {
      flexDirection: 'row',
      marginBottom: settings.skills_item_spacing || 3,
    },
    skillCategoryTitle: {
      fontSize: fontSize,
      fontFamily: 'Helvetica-Bold',
      color: '#000000',
      marginRight: 8,
      minWidth: 80,
    },
    skillItem: {
      fontSize: fontSize,
      color: '#333333',
      flexGrow: 1,
    },
    item: {
      marginBottom: settings.experience_item_spacing || 10,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 2,
    },
    itemSubheader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
      gap: 4,
    },
    itemTitle: {
      fontSize: fontSize + 1,
      fontFamily: 'Helvetica-Bold',
      color: '#000000',
    },
    itemSubtitle: {
      fontSize: fontSize,
      color: '#333333',
    },
    dateText: {
      fontSize: fontSize - 1,
      color: '#666666',
    },
    locationText: {
      fontSize: fontSize - 1,
      color: '#666666',
    },
    technologies: {
      fontSize: fontSize - 1,
      color: '#666666',
      marginBottom: 4,
    },
    bulletPoint: {
      flexDirection: 'row',
      marginBottom: 3,
      marginLeft: 4,
    },
    bulletDot: {
      marginRight: 8,
      color: '#000000',
      fontSize: fontSize,
    },
    bulletText: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    bulletTextContent: {
      fontSize: fontSize,
      color: '#333333',
      lineHeight: settings.document_line_height || 1.6,
    },
  });
}

interface MinimalistTemplateProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

export const MinimalistTemplate = memo(function MinimalistTemplate({ resume }: MinimalistTemplateProps) {
  const styles = useMemo(() => createMinimalistStyles(resume.document_settings), [resume.document_settings]);

  return (
    <PDFDocument>
      <PDFPage size="LETTER" style={styles.page}>
        <HeaderSection resume={resume} styles={styles} />
        <SkillsSection skills={resume.skills} styles={styles} />
        <ExperienceSection experiences={resume.work_experience} styles={styles} />
        <ProjectsSection projects={resume.projects} styles={styles} />
        <EducationSection education={resume.education} styles={styles} />
      </PDFPage>
    </PDFDocument>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.resume === nextProps.resume &&
    prevProps.variant === nextProps.variant
  );
});
