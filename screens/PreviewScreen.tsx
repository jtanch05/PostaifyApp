import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { PrimaryButton, FeedbackModal } from '../components';
import { useUser } from '../store/useAppStore';
import { X, Download, Share } from 'phosphor-react-native';

interface AnalysisResult {
  overallScore: number;
  feedback: {
    geometric: string;
    semantic: string;
    environmental: string;
  };
  suggestions: string[];
}

interface PreviewScreenProps {
  photoUri: string;
  onClose: () => void;
  onBack?: () => void;
}

const PreviewScreen: React.FC<PreviewScreenProps> = ({
  photoUri,
  onClose,
  onBack,
}) => {
  const user = useUser();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showPremiumUpsell, setShowPremiumUpsell] = useState(false);

  const handleAnalyzeWithAI = async () => {
    if (!user?.isPremium) {
      setShowPremiumUpsell(true);
      return;
    }

    setIsAnalyzing(true);
    setShowFeedbackModal(true);

    try {
      // TODO: Upload image to Firebase Storage
      // const storage = getStorage();
      // const imageRef = ref(storage, `poses/${Date.now()}.jpg`);
      // const uploadResult = await uploadBytes(imageRef, imageFile);
      // const downloadURL = await getDownloadURL(imageRef);

      // TODO: Call Firebase Cloud Function
      // const response = await fetch('YOUR_CLOUD_FUNCTION_URL/analyzePose', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${await user.getIdToken()}`,
      //   },
      //   body: JSON.stringify({
      //     imageUrl: downloadURL,
      //     poseTemplateId: selectedPoseId,
      //   }),
      // });

      // Mock analysis result for development
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult: AnalysisResult = {
        overallScore: 78,
        feedback: {
          geometric: "Your posture shows good alignment with the template. Your shoulders are well-positioned, but try to straighten your back slightly more for better symmetry.",
          semantic: "The pose captures the intended emotion well. Your facial expression and body language convey confidence, which matches the template's intended mood.",
          environmental: "The lighting in your photo works well for this pose. Consider moving slightly to the left to better utilize the natural lighting and avoid shadows on your face."
        },
        suggestions: [
          "Straighten your back for better posture alignment",
          "Angle your body 10 degrees to the left for optimal lighting",
          "Keep your chin up slightly to enhance the confident expression",
          "Consider taking the photo during golden hour for warmer tones"
        ]
      };

      setAnalysisResult(mockResult);
    } catch (error) {
      console.error('Error analyzing pose:', error);
      Alert.alert('Analysis Failed', 'Failed to analyze your pose. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSavePhoto = () => {
    // TODO: Save photo to device gallery
    Alert.alert('Save Photo', 'Photo saved to gallery!');
  };

  const handleSharePhoto = () => {
    // TODO: Implement sharing functionality
    Alert.alert('Share Photo', 'Sharing functionality coming soon!');
  };

  const renderPremiumUpsell = () => (
    <View style={styles.upsellContainer}>
      <Text style={styles.upsellTitle}>Unlock AI Pose Coach</Text>
      <Text style={styles.upsellText}>
        Get personalized feedback on your poses with our premium AI analysis
      </Text>
      <View style={styles.upsellFeatures}>
        <Text style={styles.upsellFeature}>• Detailed pose analysis</Text>
        <Text style={styles.upsellFeature}>• Personalized suggestions</Text>
        <Text style={styles.upsellFeature}>• Professional feedback</Text>
        <Text style={styles.upsellFeature}>• Unlimited usage</Text>
      </View>
      <View style={styles.upsellButtons}>
        <PrimaryButton
          title="Upgrade to Premium"
          onPress={() => {
            // TODO: Navigate to premium subscription flow
            Alert.alert('Premium', 'Premium subscription flow coming soon!');
          }}
          style={styles.upgradeButton}
        />
        <PrimaryButton
          title="Maybe Later"
          variant="secondary"
          onPress={() => setShowPremiumUpsell(false)}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack || onClose}>
          <X size={24} color={Colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Photo Preview</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Photo */}
      <View style={styles.photoContainer}>
        <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="contain" />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {/* AI Analysis Button */}
        <PrimaryButton
          title={user?.isPremium ? "Analyze with AI Coach" : "Unlock AI Coach"}
          onPress={handleAnalyzeWithAI}
          style={styles.aiButton}
        />

        {/* Secondary Actions */}
        <View style={styles.secondaryActions}>
          <Pressable style={styles.actionButton} onPress={handleSavePhoto}>
            <Download size={24} color={Colors.text.primary} />
            <Text style={styles.actionLabel}>Save</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={handleSharePhoto}>
            <Share size={24} color={Colors.text.primary} />
            <Text style={styles.actionLabel}>Share</Text>
          </Pressable>
        </View>
      </View>

      {/* Premium Upsell Modal */}
      {showPremiumUpsell && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {renderPremiumUpsell()}
          </View>
        </View>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        visible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        analysisResult={analysisResult}
        isLoading={isAnalyzing}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.surface,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },

  headerSpacer: {
    width: 44,
  },

  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },

  actions: {
    padding: 20,
    paddingBottom: 40,
  },

  aiButton: {
    marginBottom: 20,
  },

  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  actionButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.background.surface,
    minWidth: 80,
  },

  actionLabel: {
    ...Typography.styles.caption,
    color: Colors.text.primary,
    marginTop: 8,
  },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  modalContent: {
    backgroundColor: Colors.background.surface,
    borderRadius: 24,
    margin: 20,
    maxWidth: 400,
    width: '90%',
  },

  upsellContainer: {
    padding: 24,
    alignItems: 'center',
  },

  upsellTitle: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },

  upsellText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },

  upsellFeatures: {
    alignSelf: 'stretch',
    marginBottom: 32,
  },

  upsellFeature: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    marginBottom: 8,
    paddingLeft: 16,
  },

  upsellButtons: {
    alignSelf: 'stretch',
    gap: 12,
  },

  upgradeButton: {
    marginBottom: 12,
  },
});

export default PreviewScreen; 