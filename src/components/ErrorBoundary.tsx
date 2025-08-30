import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { colors, typography, spacing } from '../styles/tokens';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <AlertCircle size={64} color={colors.semantic.error} />
            </View>
            
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.description}>
              We're sorry, but something unexpected happened. Please try again.
            </Text>

            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={this.handleRetry}
              activeOpacity={0.8}
            >
              <RefreshCw size={20} color={colors.text.inverse} />
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>

            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Error Details (Development):</Text>
                <Text style={styles.errorMessage}>{this.state.error.message}</Text>
                {this.state.errorInfo?.componentStack && (
                  <Text style={styles.errorStack}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[50],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.layout.screenPadding,
  },
  iconContainer: {
    marginBottom: spacing[24],
    opacity: 0.8,
  },
  title: {
    ...typography.textStyles.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[12],
  },
  description: {
    ...typography.textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[32],
    lineHeight: typography.lineHeight.relaxed,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.semantic.error,
    paddingHorizontal: spacing[24],
    paddingVertical: spacing[12],
    borderRadius: spacing.radius.lg,
    gap: spacing[8],
  },
  retryText: {
    ...typography.textStyles.button,
    color: colors.text.inverse,
  },
  errorDetails: {
    marginTop: spacing[32],
    padding: spacing[16],
    backgroundColor: colors.gray[100],
    borderRadius: spacing.radius.md,
    width: '100%',
  },
  errorTitle: {
    ...typography.textStyles.bodySmall,
    fontWeight: typography.fontWeight.bold,
    color: colors.semantic.error,
    marginBottom: spacing[8],
  },
  errorMessage: {
    ...typography.textStyles.caption,
    color: colors.text.secondary,
    fontFamily: 'monospace',
    marginBottom: spacing[8],
  },
  errorStack: {
    ...typography.textStyles.caption,
    color: colors.text.tertiary,
    fontFamily: 'monospace',
  },
});