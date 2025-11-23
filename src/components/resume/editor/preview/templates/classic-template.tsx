'use client';

import { Resume } from "@/lib/types";
import { Document as PDFDocument, Page as PDFPage, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { memo, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';

// Classic two-column template with sidebar
const baseStyles = {
  link: {
    color: '#1e40af',
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
  styles: ReturnType<typeof createClassicStyles>;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.name}>{resume.first_name} {resume.last_name}</Text>
        <Text style={styles.targetRole}>{resume.target_role}</Text>
      </View>
    </View>
  );
});

const SidebarSection = memo(function SidebarSection({
  resume,
  skills,
  styles
}: {
  resume: Resume;
  skills: Resume['skills'];
  styles: ReturnType<typeof createClassicStyles>;
}) {
  return (
    <View style={styles.sidebar}>
      {/* Contact Information */}
      <View style={styles.sidebarSection}>
        <Text style={styles.sidebarTitle}>CONTACT</Text>
        <View style={styles.sidebarContent}>
          {resume.email && (
            <Link src={`mailto:${resume.email}`}>
              <Text style={styles.sidebarText}>{resume.email}</Text>
            </Link>
          )}
          {resume.phone_number && (
            <Text style={styles.sidebarText}>{resume.phone_number}</Text>
          )}
          {resume.location && (
            <Text style={styles.sidebarText}>{resume.location}</Text>
          )}
          {resume.website && (
            <Link src={resume.website.startsWith('http') ? resume.website : `https://${resume.website}`}>
              <Text style={styles.sidebarLink}>{resume.website}</Text>
            </Link>
          )}
          {resume.linkedin_url && (
            <Link src={resume.linkedin_url.startsWith('http') ? resume.linkedin_url : `https://${resume.linkedin_url}`}>
              <Text style={styles.sidebarLink}>LinkedIn</Text>
            </Link>
          )}
          {resume.github_url && (
            <Link src={resume.github_url.startsWith('http') ? resume.github_url : `https://${resume.github_url}`}>
              <Text style={styles.sidebarLink}>GitHub</Text>
            </Link>
          )}
        </View>
      </View>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>SKILLS</Text>
          <View style={styles.sidebarContent}>
            {skills.map((skillCategory, index) => (
              <View key={index} style={styles.skillCategory}>
                <Text style={styles.sidebarSubtitle}>{skillCategory.category}</Text>
                {skillCategory.items.map((skill, skillIndex) => (
                  <Text key={skillIndex} style={styles.sidebarText}>• {skill}</Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
});

const MainContent = memo(function MainContent({
  resume,
  styles
}: {
  resume: Resume;
  styles: ReturnType<typeof createClassicStyles>;
}) {
  const processText = useTextProcessor();

  return (
    <View style={styles.mainContent}>
      {/* Experience */}
      {resume.work_experience && resume.work_experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXPERIENCE</Text>
          {resume.work_experience.map((experience, index) => (
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
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROJECTS</Text>
          {resume.projects.map((project, index) => (
            <View key={index} style={styles.item}>
              <View style={styles.itemHeader}>
                <View style={styles.itemHeaderLeft}>
                  <Text style={styles.itemTitle}>{processText(project.name, true)}</Text>
                  {project.technologies && (
                    <Text style={styles.technologies}>{project.technologies.map(tech => tech.replace(/\*\*/g, '')).join(', ')}</Text>
                  )}
                </View>
                {project.date && (
                  <Text style={styles.dateText}>{project.date}</Text>
                )}
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
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          {resume.education.map((edu, index) => (
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
      )}
    </View>
  );
});

function createClassicStyles(settings: Resume['document_settings'] = {
  document_font_size: 10,
  document_line_height: 1.4,
  document_margin_vertical: 30,
  document_margin_horizontal: 30,
  header_name_size: 24,
  header_name_bottom_spacing: 4,
  skills_margin_top: 0,
  skills_margin_bottom: 8,
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
      paddingTop: settings.document_margin_vertical || 30,
      paddingBottom: settings.document_margin_vertical || 30,
      paddingLeft: settings.document_margin_horizontal || 30,
      paddingRight: settings.document_margin_horizontal || 30,
      fontFamily: 'Helvetica',
      color: '#1f2937',
      fontSize: fontSize,
      flexDirection: 'column',
    },
    header: {
      backgroundColor: '#1e40af',
      marginLeft: -(settings.document_margin_horizontal || 30),
      marginRight: -(settings.document_margin_horizontal || 30),
      marginTop: -(settings.document_margin_vertical || 30),
      paddingVertical: 20,
      paddingHorizontal: settings.document_margin_horizontal || 30,
      marginBottom: 16,
    },
    headerContent: {
      alignItems: 'center',
    },
    name: {
      fontSize: settings.header_name_size || 24,
      fontFamily: 'Helvetica-Bold',
      color: '#ffffff',
      marginBottom: settings.header_name_bottom_spacing || 4,
    },
    targetRole: {
      fontSize: fontSize + 2,
      color: '#dbeafe',
    },
    contentContainer: {
      flexDirection: 'row',
      gap: 16,
    },
    sidebar: {
      width: '30%',
      paddingRight: 16,
      borderRight: '1pt solid #e5e7eb',
    },
    sidebarSection: {
      marginBottom: 16,
    },
    sidebarTitle: {
      fontSize: fontSize,
      fontFamily: 'Helvetica-Bold',
      color: '#1e40af',
      marginBottom: 6,
      letterSpacing: 0.5,
    },
    sidebarSubtitle: {
      fontSize: fontSize - 1,
      fontFamily: 'Helvetica-Bold',
      color: '#374151',
      marginTop: 4,
      marginBottom: 2,
    },
    sidebarContent: {
      flexDirection: 'column',
      gap: 2,
    },
    sidebarText: {
      fontSize: fontSize - 1,
      color: '#4b5563',
      marginBottom: 2,
    },
    sidebarLink: {
      fontSize: fontSize - 1,
      color: '#1e40af',
      marginBottom: 2,
    },
    skillCategory: {
      marginBottom: settings.skills_margin_bottom || 8,
    },
    mainContent: {
      width: '70%',
      paddingLeft: 16,
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: fontSize + 1,
      fontFamily: 'Helvetica-Bold',
      color: '#1e40af',
      marginBottom: 8,
      borderBottom: '1pt solid #1e40af',
      paddingBottom: 2,
      letterSpacing: 0.5,
    },
    item: {
      marginBottom: settings.experience_item_spacing || 6,
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
      color: '#1e40af',
      marginTop: 1,
    },
    bulletPoint: {
      flexDirection: 'row',
      marginBottom: 2,
      marginLeft: 4,
    },
    bulletDot: {
      marginRight: 6,
      color: '#1e40af',
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
      lineHeight: settings.document_line_height || 1.4,
    },
  });
}

interface ClassicTemplateProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
}

export const ClassicTemplate = memo(function ClassicTemplate({ resume }: ClassicTemplateProps) {
  const styles = useMemo(() => createClassicStyles(resume.document_settings), [resume.document_settings]);

  return (
    <PDFDocument>
      <PDFPage size="LETTER" style={styles.page}>
        <HeaderSection resume={resume} styles={styles} />
        <View style={styles.contentContainer}>
          <SidebarSection resume={resume} skills={resume.skills} styles={styles} />
          <MainContent resume={resume} styles={styles} />
        </View>
      </PDFPage>
    </PDFDocument>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.resume === nextProps.resume &&
    prevProps.variant === nextProps.variant
  );
});
