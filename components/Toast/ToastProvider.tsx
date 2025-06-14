// src/components/ToastProvider.tsx
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { registerShowToast } from '@/utils/Toast';
import { Trophy } from 'phosphor-react-native';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setToast(null));
      }, 3000);
    });
  };


  useEffect(() => {
    registerShowToast(showToast);
  }, []);


  const getStyle = () => {
    switch (toast?.type) {
      case 'success':
        return {
            backgroundColor: 'white',
            boerderColor: 'green',
            borderSize: '2px',
            textColor: 'black',

        };
      case 'error':
        return { backgroundColor: '#F44336', icon: 'error' };
      default:
        return { backgroundColor: '#2196F3', icon: 'info' };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        // <Animated.View style={[styles.toastContainer, { opacity, backgroundColor: getStyle().backgroundColor }]}>
        //     <Trophy color={'#fcc41f'} size={38} />
            
        //     <View>
        //         <Text style={styles.title}>Conquista desbloqueada: </Text>       
        //         <Text style={styles.toastText}> {toast.message}</Text>
        //     </View>    
        // </Animated.View>

        <Animated.View style={[styles.toastContainer, { opacity }]}>
            <Trophy color={'#fcc41f'} size={38} />
            <View style={styles.content}>
                <Text style={styles.title}>Conquista desbloqueada:</Text>
                <Text style={styles.toastText}>{toast.message}</Text>
            </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'green',
    elevation: 5,
  },
  toastText: {
    color: 'black',
    fontSize: 16,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  toastMessage: {
    fontSize: 14,
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 2,
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
});


