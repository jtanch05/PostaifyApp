import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import PrimaryButton from './PrimaryButton';

interface AnalysisResult {
  overallScore: number;
  feedback: {
    geometric: string;
    semantic: string;
    environmental: string;
  };
  suggestions: string[];
}

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  analysisResult: AnalysisResult | null;
  isLoading?: boolean;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  onClose,
  analysisResult,
  isLoading = false,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return Colors.system.success;
    if (score >= 60) return Colors.accent.primary;
    return Colors.system.error;
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <BlurView intensity={20} tint="dark" style={styles.blurOverlay}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>AI Pose Coach</Text>
                <Pressable style={styles.closeButton} onPress={onClose}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </Pressable>
              </View>

              <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>
                      Analyzing your pose...
                    </Text>
                  </View>
                ) : analysisResult ? (
                  <>
                    {/* Overall Score */}
                    <View style={styles.scoreContainer}>
                      <Text style={styles.scoreLabel}>Overall Score</Text>
                      <Text
                        style={[
                          styles.scoreValue,
                          { color: getScoreColor(analysisResult.overallScore) },
                        ]}
                      >
                        {analysisResult.overallScore}/100
                      </Text>
                      <Text style={styles.scoreText}>
                        {getScoreText(analysisResult.overallScore)}
                      </Text>
                    </View>

                    {/* Feedback Sections */}
                    <View style={styles.feedbackSection}>
                      <Text style={styles.sectionTitle}>Geometric Analysis</Text>
                      <Text style={styles.feedbackText}>
                        {analysisResult.feedback.geometric}
                      </Text>
                    </View>

                    <View style={styles.feedbackSection}>
                      <Text style={styles.sectionTitle}>Semantic Analysis</Text>
                      <Text style={styles.feedbackText}>
                        {analysisResult.feedback.semantic}
                      </Text>
                    </View>

                    <View style={styles.feedbackSection}>
                      <Text style={styles.sectionTitle}>
                        Environmental Analysis
                      </Text>
                      <Text style={styles.feedbackText}>
                        {analysisResult.feedback.environmental}
                      </Text>
                    </View>

                    {/* Suggestions */}
                    {analysisResult.suggestions.length > 0 && (
                      <View style={styles.suggestionsSection}>
                        <Text style={styles.sectionTitle}>Suggestions</Text>
                        {analysisResult.suggestions.map((suggestion, index) => (
                          <View key={index} style={styles.suggestionItem}>
                            <Text style={styles.suggestionBullet}>•</Text>
                            <Text style={styles.suggestionText}>
                              {suggestion}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                      Failed to analyze pose. Please try again.
                    </Text>
                  </View>
                )}
              </ScrollView>

              <View style={styles.footer}>
                <PrimaryButton
                  title="Close"
                  onPress={onClose}
                  variant="secondary"
                />
              </View>
            </View>
          </SafeAreaView>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  blurOverlay: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  container: {
    backgroundColor: Colors.background.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '60%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.primary,
  },

  title: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },

  content: {
    flex: 1,
    padding: 20,
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },

  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  errorText: {
    ...Typography.styles.body,
    color: Colors.system.error,
    textAlign: 'center',
  },

  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 20,
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
  },

  scoreLabel: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    marginBottom: 8,
  },

  scoreValue: {
    ...Typography.styles.h1,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  scoreText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },

  feedbackSection: {
    marginBottom: 24,
  },

  sectionTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    marginBottom: 8,
  },

  feedbackText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    lineHeight: 24,
  },

  suggestionsSection: {
    marginBottom: 24,
  },

  suggestionItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },

  suggestionBullet: {
    ...Typography.styles.body,
    color: Colors.accent.primary,
    marginRight: 8,
    marginTop: 2,
  },

  suggestionText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    flex: 1,
    lineHeight: 24,
  },

  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.background.primary,
  },
});

export default FeedbackModal; 