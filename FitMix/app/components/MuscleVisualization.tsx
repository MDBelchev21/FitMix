import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G, Circle, Ellipse } from 'react-native-svg';
import { MotiView } from 'moti';

interface MuscleVisualizationProps {
  muscleProgress: {
    [key: string]: {
      progress: number;
    };
  };
  onMusclePress?: (muscleName: string, progress: number) => void;
}

const getColorForProgress = (progress: number): string => {
  const opacity = 0.8;
  if (progress >= 80) return `rgba(76, 175, 80, ${opacity})`;
  if (progress >= 60) return `rgba(139, 195, 74, ${opacity})`;
  if (progress >= 40) return `rgba(255, 235, 59, ${opacity})`;
  if (progress >= 20) return `rgba(255, 193, 7, ${opacity})`;
  return `rgba(255, 87, 34, ${opacity})`;
};

const MuscleVisualization: React.FC<MuscleVisualizationProps> = ({
  muscleProgress,
  onMusclePress
}) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 1000 }}
      style={styles.container}
    >
      <View style={styles.anatomyContainer}>
        {/* Front View */}
        <View style={styles.viewContainer}>
          <Text style={styles.viewLabel}>Front View</Text>
          <View style={styles.svgContainer}>
            <Svg width="100%" height="100%" viewBox="0 0 200 400">
              {/* Base Body Shape */}
              <Path
                d="M100,70 C140,70 150,100 150,130 C150,160 145,190 145,220 
                   C145,250 140,280 135,310 C130,340 125,370 120,390
                   M100,70 C60,70 50,100 50,130 C50,160 55,190 55,220
                   C55,250 60,280 65,310 C70,340 75,370 80,390"
                fill="none"
                stroke="#000"
                strokeWidth="1"
                opacity="0.3"
              />

              {/* Head */}
              <Ellipse cx="100" cy="35" rx="23" ry="28" fill="#f5f5f5" stroke="#000" strokeWidth="2" />
              
              {/* Neck */}
              <G onPress={() => onMusclePress?.('neck', muscleProgress.neck?.progress || 0)}>
                <Path
                  d="M90,50 
                     C90,55 88,60 85,65
                     C82,70 80,75 80,80
                     M110,50
                     C110,55 112,60 115,65
                     C118,70 120,75 120,80"
                  fill={getColorForProgress(muscleProgress.neck?.progress || 0)}
                  stroke="#000"
                  strokeWidth="2"
                />
              </G>

              {/* Upper Body Front */}
              <G>
                {/* Neck */}
                <Path
                  d="M90,50 
                     C90,60 85,70 85,80
                     M110,50
                     C110,60 115,70 115,80"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Shoulders */}
                <Path
                  d="M85,80 
                     C60,85 50,90 45,100
                     M115,80
                     C140,85 150,90 155,100"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Chest */}
                <G onPress={() => onMusclePress?.('chest', muscleProgress.chest?.progress || 0)}>
                  <Path
                    d="M85,80 
                       C90,85 95,90 100,95
                       C105,90 110,85 115,80
                       C115,90 115,100 115,110
                       C110,115 105,118 100,120
                       C95,118 90,115 85,110
                       Z"
                    fill={getColorForProgress(muscleProgress.chest?.progress || 0)}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  {/* Chest Definition Lines */}
                  <Path
                    d="M90,85 L110,85
                       M88,95 L112,95
                       M87,105 L113,105"
                    stroke="#000"
                    strokeWidth="1"
                    opacity="0.3"
                    fill="none"
                  />
                </G>

                {/* Deltoids */}
                <G onPress={() => onMusclePress?.('deltoids', muscleProgress.deltoids?.progress || 0)}>
                  {/* Left Deltoid */}
                  <Path
                    d="M85,80 
                       C75,82 65,85 55,90
                       C50,95 45,100 45,105
                       C45,110 50,115 55,115
                       C65,115 75,110 85,105
                       Z"
                    fill={getColorForProgress(muscleProgress.deltoids?.progress || 0)}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  {/* Right Deltoid */}
                  <Path
                    d="M115,80 
                       C125,82 135,85 145,90
                       C150,95 155,100 155,105
                       C155,110 150,115 145,115
                       C135,115 125,110 115,105
                       Z"
                    fill={getColorForProgress(muscleProgress.deltoids?.progress || 0)}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  {/* Deltoid Definition Lines */}
                  <Path
                    d="M60,95 C65,100 70,102 75,103
                       M140,95 C135,100 130,102 125,103"
                    stroke="#000"
                    strokeWidth="1"
                    opacity="0.3"
                    fill="none"
                  />
                </G>

                {/* Shoulders */}
                <G onPress={() => onMusclePress?.('shoulders', muscleProgress.shoulders?.progress || 0)}>
                  {/* Left Shoulder */}
                  <Path
                    d="M85,80 
                       C75,82 65,85 55,90
                       C50,95 45,100 45,105
                       C45,110 50,115 55,115
                       C65,115 75,110 85,105"
                    fill={getColorForProgress(muscleProgress.shoulders?.progress || 0)}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  {/* Right Shoulder */}
                  <Path
                    d="M115,80 
                       C125,82 135,85 145,90
                       C150,95 155,100 155,105
                       C155,110 150,115 145,115
                       C135,115 125,110 115,105"
                    fill={getColorForProgress(muscleProgress.shoulders?.progress || 0)}
                    stroke="#000"
                    strokeWidth="2"
                  />
                </G>

                {/* Back */}
                <G>
                  {/* Upper Back */}
                  <G onPress={() => onMusclePress?.('upperBack', muscleProgress.upperBack?.progress || 0)}>
                    {/* Trapezius */}
                    <Path
                      d="M85,80 
                         C90,70 95,60 100,50
                         C105,60 110,70 115,80
                         C110,85 105,87 100,88
                         C95,87 90,85 85,80
                         Z"
                      fill={getColorForProgress(muscleProgress.upperBack?.progress || 0)}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    {/* Trap Definition Lines */}
                    <Path
                      d="M90,65 C95,63 105,63 110,65
                         M92,75 C96,73 104,73 108,75"
                      stroke="#000"
                      strokeWidth="1"
                      opacity="0.3"
                      fill="none"
                    />
                  </G>

                  {/* Lats */}
                  <G onPress={() => onMusclePress?.('lats', muscleProgress.lats?.progress || 0)}>
                    {/* Left Lat */}
                    <Path
                      d="M85,80 
                         C75,90 70,100 70,120
                         C70,130 75,140 85,145
                         C90,147 95,148 100,148
                         C95,145 90,140 85,135
                         C80,130 75,125 70,120
                         Z"
                      fill={getColorForProgress(muscleProgress.lats?.progress || 0)}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    {/* Right Lat */}
                    <Path
                      d="M115,80 
                         C125,90 130,100 130,120
                         C130,130 125,140 115,145
                         C110,147 105,148 100,148
                         C105,145 110,140 115,135
                         C120,130 125,125 130,120
                         Z"
                      fill={getColorForProgress(muscleProgress.lats?.progress || 0)}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    {/* Lat Definition Lines */}
                    <Path
                      d="M80,100 C85,95 90,93 95,92
                         M120,100 C115,95 110,93 105,92
                         M75,120 C80,115 85,113 90,112
                         M125,120 C120,115 115,113 110,112"
                      stroke="#000"
                      strokeWidth="1"
                      opacity="0.3"
                      fill="none"
                    />
                  </G>

                  {/* Lower Back */}
                  <G onPress={() => onMusclePress?.('lowerBack', muscleProgress.lowerBack?.progress || 0)}>
                    <Path
                      d="M85,145 
                         C90,150 95,152 100,153
                         C105,152 110,150 115,145
                         C115,155 115,165 115,175
                         C110,177 105,178 100,178
                         C95,178 90,177 85,175
                         Z"
                      fill={getColorForProgress(muscleProgress.lowerBack?.progress || 0)}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    {/* Lower Back Definition Lines */}
                    <Path
                      d="M90,155 C95,153 105,153 110,155
                         M88,165 C95,163 105,163 112,165"
                      stroke="#000"
                      strokeWidth="1"
                      opacity="0.3"
                      fill="none"
                    />
                  </G>
                </G>

                {/* Glutes */}
                <G onPress={() => onMusclePress?.('glutes', muscleProgress.glutes?.progress || 0)}>
                  {/* Left Glute */}
                  <Path
                    d="M80,175 
                       C75,180 70,185 70,190
                       C70,200 75,210 85,215
                       C90,217 95,218 100,218
                       C95,215 90,210 85,205
                       C80,200 75,195 70,190
                       Z"
                    fill={getColorForProgress(muscleProgress.glutes?.progress || 0)}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  {/* Right Glute */}
                  <Path
                    d="M120,175 
                       C125,180 130,185 130,190
                       C130,200 125,210 115,215
                       C110,217 105,218 100,218
                       C105,215 110,210 115,205
                       C120,200 125,195 130,190
                       Z"
                    fill={getColorForProgress(muscleProgress.glutes?.progress || 0)}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  {/* Glute Definition Lines */}
                  <Path
                    d="M80,190 C85,185 90,183 95,182
                       M120,190 C115,185 110,183 105,182
                       M75,205 C80,200 85,198 90,197
                       M125,205 C120,200 115,198 110,197"
                    stroke="#000"
                    strokeWidth="1"
                    opacity="0.3"
                    fill="none"
                  />
                </G>

                {/* Arms */}
                <G>
                  {/* Biceps */}
                  <G onPress={() => onMusclePress?.('biceps', muscleProgress.biceps?.progress || 0)}>
                    {/* Left Bicep */}
                    <Path
                      d="M45,105 
                         C40,115 38,125 40,135
                         C42,145 45,155 50,160
                         C55,165 60,168 65,170"
                      fill={getColorForProgress(muscleProgress.biceps?.progress || 0)}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    {/* Right Bicep */}
                    <Path
                      d="M155,105 
                         C160,115 162,125 160,135
                         C158,145 155,155 150,160
                         C145,165 140,168 135,170"
                      fill={getColorForProgress(muscleProgress.biceps?.progress || 0)}
                      stroke="#000"
                      strokeWidth="2"
                    />
                  </G>

                  {/* Triceps */}
                  <G onPress={() => onMusclePress?.('triceps', muscleProgress.triceps?.progress || 0)}>
                    {/* Left Tricep */}
                    <Path
                      d="M45,105 
                         C40,115 38,125 40,135
                         C42,145 45,155 50,160
                         C55,165 60,168 65,170"
                      fill={getColorForProgress(muscleProgress.triceps?.progress || 0)}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    {/* Right Tricep */}
                    <Path
                      d="M155,105 
                         C160,115 162,125 160,135
                         C158,145 155,155 150,160
                         C145,165 140,168 135,170"
                      fill={getColorForProgress(muscleProgress.triceps?.progress || 0)}
                      stroke="#000"
                      strokeWidth="2"
                    />
                  </G>
                </G>

                {/* Forearms */}
                <G onPress={() => onMusclePress?.('forearms', muscleProgress.forearms?.progress || 0)}>
                  {/* Left Forearm */}
                  <Path
                    d="M45,160 
                       C40,170 38,180 35,190
                       C32,200 30,210 30,220
                       C35,215 40,210 45,205
                       C50,200 55,195 60,190"
                    fill={getColorForProgress(muscleProgress.forearms?.progress || 0)}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  {/* Right Forearm */}
                  <Path
                    d="M155,160 
                       C160,170 162,180 165,190
                       C168,200 170,210 170,220
                       C165,215 160,210 155,205
                       C150,200 145,195 140,190"
                    fill={getColorForProgress(muscleProgress.forearms?.progress || 0)}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  {/* Forearm Definition Lines */}
                  <Path
                    d="M35,180 C40,175 45,170 50,165
                       M165,180 C160,175 155,170 150,165"
                    stroke="#000"
                    strokeWidth="1"
                    opacity="0.3"
                    fill="none"
                  />
                </G>

                {/* Abs */}
                <G onPress={() => onMusclePress?.('abs', muscleProgress.abs?.progress || 0)}>
                  <Path
                    d="M90,110 
                       C95,115 105,115 110,110
                       L110,170
                       C105,175 95,175 90,170
                       Z"
                    fill={getColorForProgress(muscleProgress.abs?.progress || 0)}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  {/* Ab Definition Lines */}
                  <Path
                    d="M90,125 L110,125
                       M90,140 L110,140
                       M90,155 L110,155"
                    stroke="#000"
                    strokeWidth="1"
                    opacity="0.3"
                    fill="none"
                  />
                </G>

                {/* Obliques */}
                <G onPress={() => onMusclePress?.('obliques', muscleProgress.obliques?.progress || 0)}>
                  {/* Left Oblique */}
                  <Path
                    d="M85,110 
                       C80,120 75,130 70,140
                       C65,150 60,160 60,170
                       C65,165 70,160 75,155
                       C80,150 85,145 90,140"
                    fill={getColorForProgress(muscleProgress.obliques?.progress || 0)}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  {/* Right Oblique */}
                  <Path
                    d="M115,110 
                       C120,120 125,130 130,140
                       C135,150 140,160 140,170
                       C135,165 130,160 125,155
                       C120,150 115,145 110,140"
                    fill={getColorForProgress(muscleProgress.obliques?.progress || 0)}
                    stroke="#000"
                    strokeWidth="2"
                  />
                  {/* Oblique Definition Lines */}
                  <Path
                    d="M70,130 C75,125 80,120 85,115
                       M130,130 C125,125 120,120 115,115"
                    stroke="#000"
                    strokeWidth="1"
                    opacity="0.3"
                    fill="none"
                  />
                </G>

                {/* Legs */}
                <G>
                  {/* Quads */}
                  <G onPress={() => onMusclePress?.('quads', muscleProgress.quads?.progress || 0)}>
                    {/* Left Quad */}
                    <Path
                      d="M70,170 
                         C65,190 60,210 60,230
                         C60,250 65,270 70,290
                         C75,270 80,250 80,230
                         C80,210 75,190 70,170"
                      fill={getColorForProgress(muscleProgress.quads?.progress || 0)}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    {/* Right Quad */}
                    <Path
                      d="M130,170 
                         C135,190 140,210 140,230
                         C140,250 135,270 130,290
                         C125,270 120,250 120,230
                         C120,210 125,190 130,170"
                      fill={getColorForProgress(muscleProgress.quads?.progress || 0)}
                      stroke="#000"
                      strokeWidth="2"
                    />
                  </G>

                  {/* Hamstrings */}
                  <G onPress={() => onMusclePress?.('hamstrings', muscleProgress.hamstrings?.progress || 0)}>
                    {/* Left Hamstring */}
                    <Path
                      d="M80,170 
                         C75,190 70,210 70,230
                         C70,250 75,270 80,290
                         C85,270 90,250 90,230
                         C90,210 85,190 80,170"
                      fill={getColorForProgress(muscleProgress.hamstrings?.progress || 0)}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    {/* Right Hamstring */}
                    <Path
                      d="M120,170 
                         C125,190 130,210 130,230
                         C130,250 125,270 120,290
                         C115,270 110,250 110,230
                         C110,210 115,190 120,170"
                      fill={getColorForProgress(muscleProgress.hamstrings?.progress || 0)}
                      stroke="#000"
                      strokeWidth="2"
                    />
                  </G>

                  {/* Calves */}
                  <G onPress={() => onMusclePress?.('calves', muscleProgress.calves?.progress || 0)}>
                    {/* Left Calf */}
                    <Path
                      d="M70,290 
                         C65,310 60,330 60,350
                         C60,370 65,390 70,400
                         C75,390 80,370 80,350
                         C80,330 75,310 70,290"
                      fill={getColorForProgress(muscleProgress.calves?.progress || 0)}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    {/* Right Calf */}
                    <Path
                      d="M130,290 
                         C135,310 140,330 140,350
                         C140,370 135,390 130,400
                         C125,390 120,370 120,350
                         C120,330 125,310 130,290"
                      fill={getColorForProgress(muscleProgress.calves?.progress || 0)}
                      stroke="#000"
                      strokeWidth="2"
                    />
                  </G>

                  {/* Leg Definition Lines */}
                  <Path
                    d="M60,200 L140,200
                       M60,250 L140,250
                       M60,300 L140,300
                       M60,350 L140,350"
                    stroke="#000"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.3"
                  />
                </G>
              </G>

              {/* Upper Body Back */}
              <G>
                {/* Trapezius */}
                <Path
                  d="M85,80 
                     C90,70 95,60 100,50
                     C105,60 110,70 115,80
                     C110,85 105,87 100,88
                     C95,87 90,85 85,80"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />
                {/* Latissimus Dorsi */}
                <Path
                  d="M85,80 
                     C75,100 70,120 70,140
                     M115,80
                     C125,100 130,120 130,140
                     M70,140
                     C80,145 120,145 130,140"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Lower Back */}
                <Path
                  d="M90,140 
                     C95,160 100,180 100,200
                     M110,140
                     C105,160 100,180 100,200"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />
              </G>

              {/* Legs */}
              <G>
                {/* Quads */}
                <Path
                  d="M70,170 
                     C65,190 60,210 60,230
                     C60,250 65,270 70,290
                     M130,170
                     C135,190 140,210 140,230
                     C140,250 135,270 130,290"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Hamstrings */}
                <Path
                  d="M80,170 
                     C75,190 70,210 70,230
                     C70,250 75,270 80,290
                     M120,170
                     C125,190 130,210 130,230
                     C130,250 125,270 120,290"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Calves */}
                <Path
                  d="M70,290 
                     C65,310 60,330 60,350
                     C60,370 65,390 70,400
                     M130,290
                     C135,310 140,330 140,350
                     C140,370 135,390 130,400"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Muscle Definition Lines */}
                <Path
                  d="M60,200 L140,200
                     M60,250 L140,250
                     M60,300 L140,300
                     M60,350 L140,350"
                  stroke="#000"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                />
              </G>
            </Svg>
          </View>
        </View>

        {/* Back View */}
        <View style={styles.viewContainer}>
          <Text style={styles.viewLabel}>Back View</Text>
          <View style={styles.svgContainer}>
            <Svg width="100%" height="100%" viewBox="0 0 200 400">
              {/* Base Body Shape */}
              <Path
                d="M100,70 C140,70 150,100 150,130 C150,160 145,190 145,220 
                   C145,250 140,280 135,310 C130,340 125,370 120,390
                   M100,70 C60,70 50,100 50,130 C50,160 55,190 55,220
                   C55,250 60,280 65,310 C70,340 75,370 80,390"
                fill="none"
                stroke="#000"
                strokeWidth="1"
                opacity="0.3"
              />

              {/* Head */}
              <Ellipse cx="100" cy="35" rx="23" ry="28" fill="#f5f5f5" stroke="#000" strokeWidth="2" />
              
              {/* Neck */}
              <Path 
                d="M88,58 C88,65 94,72 100,72 C106,72 112,65 112,58" 
                fill="#f5f5f5" 
                stroke="#000" 
                strokeWidth="2" 
              />

              {/* Upper Body Front */}
              <G>
                {/* Neck */}
                <Path
                  d="M90,50 
                     C90,60 85,70 85,80
                     M110,50
                     C110,60 115,70 115,80"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Shoulders */}
                <Path
                  d="M85,80 
                     C60,85 50,90 45,100
                     M115,80
                     C140,85 150,90 155,100"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Chest */}
                <Path
                  d="M85,80 
                     C90,90 95,100 100,110
                     M115,80
                     C110,90 105,100 100,110
                     M85,80
                     C95,85 105,85 115,80"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Abs */}
                <Path
                  d="M90,110 
                     L90,170
                     M110,110
                     L110,170
                     M90,125 L110,125
                     M90,140 L110,140
                     M90,155 L110,155"
                  stroke="#000"
                  strokeWidth="2"
                  fill="none"
                />

                {/* Arms */}
                <Path
                  d="M45,100
                     C40,120 35,140 35,160
                     M155,100
                     C160,120 165,140 165,160"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Forearms */}
                <Path
                  d="M35,160
                     C33,180 30,200 30,220
                     M165,160
                     C167,180 170,200 170,220"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />
              </G>

              {/* Upper Body Back */}
              <G>
                {/* Trapezius */}
                <Path
                  d="M85,80 
                     C90,70 95,60 100,50
                     M115,80
                     C110,70 105,60 100,50"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Latissimus Dorsi */}
                <Path
                  d="M85,80 
                     C75,100 70,120 70,140
                     M115,80
                     C125,100 130,120 130,140
                     M70,140
                     C80,145 120,145 130,140"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Lower Back */}
                <Path
                  d="M90,140 
                     C95,160 100,180 100,200
                     M110,140
                     C105,160 100,180 100,200"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />
              </G>

              {/* Legs */}
              <G>
                {/* Quads */}
                <Path
                  d="M70,170 
                     C65,190 60,210 60,230
                     C60,250 65,270 70,290
                     M130,170
                     C135,190 140,210 140,230
                     C140,250 135,270 130,290"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Hamstrings */}
                <Path
                  d="M80,170 
                     C75,190 70,210 70,230
                     C70,250 75,270 80,290
                     M120,170
                     C125,190 130,210 130,230
                     C130,250 125,270 120,290"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Calves */}
                <Path
                  d="M70,290 
                     C65,310 60,330 60,350
                     C60,370 65,390 70,400
                     M130,290
                     C135,310 140,330 140,350
                     C140,370 135,390 130,400"
                  stroke="#000"
                  strokeWidth="2"
                  fill="#f5f5f5"
                />

                {/* Muscle Definition Lines */}
                <Path
                  d="M60,200 L140,200
                     M60,250 L140,250
                     M60,300 L140,300
                     M60,350 L140,350"
                  stroke="#000"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                />
              </G>
            </Svg>
          </View>
        </View>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 10,
  },
  anatomyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  viewContainer: {
    alignItems: 'center',
    flex: 1,
  },
  viewLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  svgContainer: {
    width: 150,
    height: 400,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default MuscleVisualization;
