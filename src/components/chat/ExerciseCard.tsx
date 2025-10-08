import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Clock, X } from 'lucide-react-native';

interface ExerciseCardProps {
  exercise: {
    id: number;
    type: string;
    name: string;
    duration: string;
    description: string;
    category: string;
    difficulty: string;
    icon: React.ComponentType<{ size: number; color: string }>;
    color: string[];
    image: any;
  };
  onStart: (exercise: any) => void;
  onDismiss: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onStart,
  onDismiss,
}) => {
  if (!exercise) return null;

  return (
    <View style={{margin: 15}}>
      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          overflow: 'hidden'
        }}
        activeOpacity={0.9}
        onPress={() => onStart(exercise)}
      >
        {/* Background Image Section */}
        <View style={{height: 120, position: 'relative'}}>
          <Image 
            source={exercise.image}
            style={{width: '100%', height: '100%'}}
            contentFit="cover"
          />
          <View style={{position: 'absolute', top: 15, right: 15}}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.95)']}
              style={{width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}
            >
              <exercise.icon size={20} color={exercise.color[1]} />
            </LinearGradient>
          </View>
        </View>

        {/* Content Section */}
        <View style={{padding: 16}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#1f2937', flex: 1}}>
              {exercise.name}
            </Text>
            <View style={{backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 8}}>
              <Text style={{fontSize: 12, fontWeight: '600', color: '#6b7280'}}>
                {exercise.difficulty}
              </Text>
            </View>
          </View>
          
          <Text style={{fontSize: 14, color: '#6b7280', lineHeight: 20, marginBottom: 12}}>
            {exercise.description}
          </Text>
          
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                <Clock size={12} color="#9b9b9b" />
                <Text style={{fontSize: 12, color: '#9b9b9b'}}>
                  {exercise.duration}
                </Text>
              </View>
              <View style={{width: 1, height: 12, backgroundColor: '#e5e7eb'}} />
              <Text style={{fontSize: 12, color: '#9b9b9b'}}>
                {exercise.category}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              style={{padding: 4}}
            >
              <X size={16} color="#9b9b9b" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ExerciseCard;