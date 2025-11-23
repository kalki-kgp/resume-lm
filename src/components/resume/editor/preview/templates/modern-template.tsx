'use client';

import { Resume } from "@/lib/types";
import { Document as PDFDocument, Page as PDFPage, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { memo, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';

// Modern template with accent colors and clean design
const baseStyles = {
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
  },
  bulletSeparator: {
    color: '#6b7280',
    marginHorizontal: 2,
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
  styles: ReturnType<typeof createModernStyles>;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.name}>{resume.first_name} {resume.last_name}</Text>
      <Text style={styles.targetRole}>{resume.target_role}</Text>
      <View style={styles.contactInfo}>
        {resume.location && (
          <>
            <Text>{resume.location}</Text>
            {(resume.email || resume.phone_number || resume.website || resume.linkedin_url || resume.github_url) && (
              <Text style={styles.bulletSeparator}>•</Text>
            )}
          </>
        )}
        {resume.email && (
          <>
            <Link src={`mailto:${resume.email}`}><Text style={styles.link}>{resume.email}</Text></Link>
            {(resume.phone_number || resume.website || resume.linkedin_url || resume.github_url) && (
              <Text style={styles.bulletSeparator}>•</Text>
            )}
          </>
        )}
        {resume.phone_number && (
          <>
            <Text>{resume.phone_number}</Text>
            {(resume.website || resume.linkedin_url || resume.github_url) && (
              <Text style={styles.bulletSeparator}>•</Text>
            )}
          </>
        )}
        {resume.website && (
          <>
            <Link src={resume.website.startsWith('http') ? resume.website : `https://${resume.website}`}>
              <Text style={styles.link}>{resume.website}</Text>
            </Link>
            {(resume.linkedin_url || resume.github_url) && (
              <Text style={styles.bulletSeparator}>•</Text>
            )}
          </>
        )}
        {resume.linkedin_url && (
          <>
            <Link src={resume.linkedin_url.startsWith('http') ? resume.linkedin_url : `https://${resume.linkedin_url}`}>
              <Text style={styles.link}>LinkedIn</Text>
            </Link>
            {resume.github_url && <Text style={styles.bulletSeparator}>•</Text>}
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
  styles: ReturnType<typeof createModernStyles>;
}) {
  if (!skills?.length) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SKILLS</Text>
      </View>
      <View style={styles.skillsContent}>
        {skills.map((skillCategory, index) => (
          <View key={index} style={styles.skillCategory}>
            <Text style={styles.skillCategoryTitle}>{skillCategory.category}:</Text>
            <Text style={styles.skillItem}>{skillCategory.items.join(', ')}</Text>
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
  styles: ReturnType<typeof createModernStyles>;
}) {
  const processText = useTextProcessor();
  if (!experiences?.length) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>EXPERIENCE</Text>
      </View>
      {experiences.map((experience, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.itemHeader}>
            <View style={styles.itemHeaderLeft}>
              <Text style={styles.itemTitle}>{processText(experience.position, true)}</Text>
              <Text style={styles.itemSubtitle}>{processText(experience.company, true)}</Text>
            </View>
            <View style={styles.itemHeaderRight}>
              <Text style={styles.dateText}>{experience.date}</Text>
              {experience.location && <Text style={styles.locationText}>{experience.location}</Text>}
            </View>
          </View>
          {experience.description.map((bullet, bulletIndex) => (
            <View key={bulletIndex} style={styles.bulletPoint}>
              <Text style={styles.bulletDot}>•</Text>
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
  styles: ReturnType<typeof createModernStyles>;
}) {
  const processText = useTextProcessor();
  if (!projects?.length) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PROJECTS</Text>
      </View>
      {projects.map((project, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.itemHeader}>
            <View style={styles.itemHeaderLeft}>
              <Text style={styles.itemTitle}>{processText(project.name, true)}</Text>
              {project.technologies && (
                <Text style={styles.technologies}>{project.technologies.map(tech => tech.replace(/\*\*/g, '')).join(', ')}</Text>
              )}
            </View>
            <View style={styles.itemHeaderRight}>
              {project.date && <Text style={styles.dateText}>{project.date}</Text>}
            </View>
          </View>
          {project.description.map((bullet, bulletIndex) => (
            <View key={bulletIndex} style={styles.bulletPoint}>
              <Text style={styles.bulletDot}>•</Text>
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
  styles: ReturnType<typeof createModernStyles>;
}) {
  const processText = useTextProcessor();
  if (!education?.length) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>EDUCATION</Text>
      </View>
      {education.map((edu, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.itemHeader}>
            <View style={styles.itemHeaderLeft}>
              <Text style={styles.itemTitle}>{processText(edu.school, true)}</Text>
              <Text style={styles.itemSubtitle}>{processText(`${edu.degree} ${edu.field}`)}</Text>
            </View>
            <Text style={styles.dateText}>{edu.date}</Text>
          </View>
          {edu.achievements && edu.achievements.map((achievement, bulletIndex) => (
            <View key={bulletIndex} style={styles.bulletPoint}>
              <Text style={styles.bulletDot}>•</Text>
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

function createModernStyles(settings: Resume['document_settings'] = {
  document_font_size: 10,
  document_line_height: 1.5,
  document_margin_vertical: 40,
  document_margin_horizontal: 40,
  header_name_size: 28,
  header_name_bottom_spacing: 4,
  skills_margin_top: 0,
  skills_margin_bottom: 0,
  skills_margin_horizontal: 0,
  skills_item_spacing: 2,
  experience_margin_top: 0,
  experience_margin_bottom: 0,
  experience_margin_horizontal: 0,
  experience_item_spacing: 6,
  projects_margin_top: 0,
  projects_margin_bottom: 0,
  projects_margin_horizontal: 0,
  projects_item_spacing: 6,
  education_margin_top: 0,
  education_margin_bottom: 0,
  education_margin_horizontal: 0,
  education_item_spacing: 6,
  footer_width: 80,
}) {
  const fontSize = settings.document_font_size || 10;

  return StyleSheet.create({
    ...baseStyles,
    page: {
      paddingTop: settings.document_margin_vertical || 40,
      paddingBottom: settings.document_margin_vertical || 40,
      paddingLeft: settings.document_margin_horizontal || 40,
      paddingRight: settings.document_margin_horizontal || 40,
      fontFamily: 'Helvetica',
      color: '#1f2937',
      fontSize: fontSize,
      lineHeight: settings.document_line_height || 1.5,
    },
    header: {
      marginBottom: 20,
      borderBottom: '2pt solid #3b82f6',
      paddingBottom: 12,
    },
    name: {
      fontSize: settings.header_name_size || 28,
      fontFamily: 'Helvetica-Bold',
      color: '#1f2937',
      marginBottom: settings.header_name_bottom_spacing || 4,
    },
    targetRole: {
      fontSize: fontSize + 2,
      color: '#3b82f6',
      marginBottom: 8,
      fontFamily: 'Helvetica-Bold',
    },
    contactInfo: {
      fontSize: fontSize - 1,
      color: '#6b7280',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    section: {
      marginBottom: 16,
    },
    sectionHeader: {
      marginBottom: 8,
      borderLeft: '3pt solid #3b82f6',
      paddingLeft: 8,
    },
    sectionTitle: {
      fontSize: fontSize + 2,
      fontFamily: 'Helvetica-Bold',
      color: '#1f2937',
      letterSpacing: 1,
    },
    skillsContent: {
      flexDirection: 'column',
      gap: settings.skills_item_spacing || 2,
      marginLeft: 11,
    },
    skillCategory: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: settings.skills_item_spacing || 2,
    },
    skillCategoryTitle: {
      fontSize: fontSize,
      fontFamily: 'Helvetica-Bold',
      color: '#1f2937',
      marginRight: 4,
    },
    skillItem: {
      fontSize: fontSize,
      color: '#4b5563',
      flexGrow: 1,
    },
    item: {
      marginBottom: settings.experience_item_spacing || 6,
      marginLeft: 11,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    itemHeaderLeft: {
      flexDirection: 'column',
      flexGrow: 1,
    },
    itemHeaderRight: {
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    itemTitle: {
      fontSize: fontSize + 1,
      fontFamily: 'Helvetica-Bold',
      color: '#1f2937',
    },
    itemSubtitle: {
      fontSize: fontSize,
      color: '#4b5563',
      marginTop: 1,
    },
    dateText: {
      fontSize: fontSize - 1,
      color: '#6b7280',
      fontFamily: 'Helvetica-Bold',
    },
    locationText: {
      fontSize: fontSize - 1,
      color: '#9ca3af',
      marginTop: 1,
    },
    technologies: {
      fontSize: fontSize - 1,
      color: '#3b82f6',
      marginTop: 1,
    },
    bulletPoint: {
      flexDirection: 'row',
      marginBottom: 2,
      marginLeft: 8,
      paddingLeft: 4,
    },
    bulletDot: {
      marginRight: 8,
      color: '#3b82f6',
      fontSize: fontSize,
    },
    bulletText: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    bulletTextContent: {
      fontSize: fontSize,
      color: '#374151',
      lineHeight: settings.document_line_height || 1.5,
    },
  });
}

interface ModernTemplateProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

export const ModernTemplate = memo(function ModernTemplate({ resume }: ModernTemplateProps) {
  const styles = useMemo(() => createModernStyles(resume.document_settings), [resume.document_settings]);

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
