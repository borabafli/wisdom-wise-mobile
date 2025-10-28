import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { ArrowLeft, ExternalLink } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { privacyPolicyScreenStyles as styles } from '../styles/components/PrivacyPolicyScreen.styles';
import { LEGAL_URLS } from '../constants/legal';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onBack }) => {
  const { t } = useTranslation();

  const handleOpenFullPolicy = async () => {
    try {
      const canOpen = await Linking.canOpenURL(LEGAL_URLS.PRIVACY_POLICY);
      if (canOpen) {
        await Linking.openURL(LEGAL_URLS.PRIVACY_POLICY);
      } else {
        Alert.alert('Error', 'Unable to open the privacy policy online.');
      }
    } catch (error) {
      console.error('Error opening privacy policy URL:', error);
      Alert.alert('Error', 'Failed to open privacy policy. Please try again.');
    }
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#2B475E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.menu.privacy')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>

          <Text style={styles.title}>PRIVACY POLICY</Text>
          <Text style={styles.lastUpdated}>Last updated October 07, 2025</Text>

          {/* View Full Policy Button */}
          <TouchableOpacity 
            style={styles.fullPolicyButton}
            onPress={handleOpenFullPolicy}
            activeOpacity={0.7}
          >
            <ExternalLink size={18} color="#36657d" />
            <Text style={styles.fullPolicyButtonText}>View Full Privacy Policy Online</Text>
          </TouchableOpacity>

          <Text style={styles.mainText}>
            This Privacy Notice for Zenify ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
          </Text>

          <Text style={styles.bulletPoint}>
            • Download and use our mobile application (Zenify), or any other application of ours that links to this Privacy Notice
          </Text>
          <Text style={styles.bulletPoint}>
            • Use Zenify. A comprehensive mental health companion app that empowers users to engage in meaningful conversations with an advanced AI therapist. Drawing from evidence-based therapies like CBT, ACT, Mindfulness, and more, Turtle provides personalized guidance, real-time insights, and interactive exercises to foster self-discovery, emotional resilience, and personal growth.
          </Text>
          <Text style={styles.bulletPoint}>
            • Engage with us in other related ways, including any sales, marketing, or events
          </Text>

          <Text style={styles.mainText}>
            Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services.
          </Text>

          <Text style={styles.sectionTitle}>SUMMARY OF KEY POINTS</Text>
          <Text style={styles.mainText}>
            This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.
          </Text>

          <Text style={styles.keyPoint}>
            <Text style={styles.keyPointTitle}>What personal information do we process?</Text> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.
          </Text>

          <Text style={styles.keyPoint}>
            <Text style={styles.keyPointTitle}>Do we process any sensitive personal information?</Text> Some of the information may be considered "special" or "sensitive" in certain jurisdictions, for example your racial or ethnic origins, sexual orientation, and religious beliefs. We do not process sensitive personal information.
          </Text>

          <Text style={styles.keyPoint}>
            <Text style={styles.keyPointTitle}>Do we collect any information from third parties?</Text> We do not collect any information from third parties.
          </Text>

          <Text style={styles.keyPoint}>
            <Text style={styles.keyPointTitle}>How do we process your information?</Text> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.
          </Text>

          <Text style={styles.sectionTitle}>1. WHAT INFORMATION DO WE COLLECT?</Text>

          <Text style={styles.subsectionTitle}>Personal information you disclose to us</Text>
          <Text style={styles.shortText}>In Short: We collect personal information that you provide to us.</Text>

          <Text style={styles.mainText}>
            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
          </Text>

          <Text style={styles.mainText}>
            <Text style={styles.boldText}>Personal Information Provided by You.</Text> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
          </Text>

          <Text style={styles.bulletPoint}>• names</Text>
          <Text style={styles.bulletPoint}>• email addresses</Text>
          <Text style={styles.bulletPoint}>• usernames</Text>
          <Text style={styles.bulletPoint}>• passwords</Text>

          <Text style={styles.mainText}>
            <Text style={styles.boldText}>Sensitive Information.</Text> We do not process sensitive information.
          </Text>

          <Text style={styles.mainText}>
            <Text style={styles.boldText}>Payment Data.</Text> We may collect data necessary to process your payment if you choose to make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is handled and stored by Revenue Cat. You may find their privacy notice link(s) here: https://www.revenuecat.com/privacy.
          </Text>

          <Text style={styles.sectionTitle}>2. HOW DO WE PROCESS YOUR INFORMATION?</Text>
          <Text style={styles.shortText}>In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</Text>

          <Text style={styles.mainText}>
            We process your personal information for a variety of reasons, depending on how you interact with our Services, including:
          </Text>

          <Text style={styles.bulletPoint}>
            • To facilitate account creation and authentication and otherwise manage user accounts
          </Text>
          <Text style={styles.bulletPoint}>
            • To save or protect an individual's vital interest, such as to prevent harm
          </Text>

          <Text style={styles.sectionTitle}>5. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</Text>
          <Text style={styles.shortText}>In Short: We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies.</Text>

          <Text style={styles.mainText}>
            As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies (collectively, "AI Products"). These tools are designed to enhance your experience and provide you with innovative solutions.
          </Text>

          <Text style={styles.subsectionTitle}>Use of AI Technologies</Text>
          <Text style={styles.mainText}>
            We provide the AI Products through third-party service providers ("AI Service Providers"), including Google Cloud AI. As outlined in this Privacy Notice, your input, output, and personal information will be shared with and processed by these AI Service Providers to enable your use of our AI Products.
          </Text>

          <Text style={styles.subsectionTitle}>Our AI Products</Text>
          <Text style={styles.mainText}>Our AI Products are designed for the following functions:</Text>
          <Text style={styles.bulletPoint}>• AI insights</Text>
          <Text style={styles.bulletPoint}>• AI bots</Text>

          <Text style={styles.sectionTitle}>8. HOW DO WE KEEP YOUR INFORMATION SAFE?</Text>
          <Text style={styles.shortText}>In Short: We aim to protect your personal information through a system of organizational and technical security measures.</Text>

          <Text style={styles.mainText}>
            We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </Text>

          <Text style={styles.sectionTitle}>9. DO WE COLLECT INFORMATION FROM MINORS?</Text>
          <Text style={styles.shortText}>In Short: We do not knowingly collect data from or market to children under 18 years of age.</Text>

          <Text style={styles.mainText}>
            We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services.
          </Text>

          <Text style={styles.sectionTitle}>10. WHAT ARE YOUR PRIVACY RIGHTS?</Text>
          <Text style={styles.shortText}>In Short: Depending on your state of residence, you have rights that allow you greater access to and control over your personal information.</Text>

          <Text style={styles.mainText}>
            In some regions (like the EEA, UK, and Switzerland), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making.
          </Text>

          <Text style={styles.sectionTitle}>14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</Text>
          <Text style={styles.mainText}>
            If you have questions or comments about this notice, you may contact us by post at:
          </Text>
          <Text style={styles.contactInfo}>
            Zenify{'\n'}
            Bulgaria
          </Text>

          <Text style={styles.sectionTitle}>15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</Text>
          <Text style={styles.mainText}>
            Based on the applicable laws of your country or state of residence, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. To request to review, update, or delete your personal information, please fill out and submit a data subject access request.
          </Text>

        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default PrivacyPolicyScreen;