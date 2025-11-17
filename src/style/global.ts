import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  // Typography
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  
  // Inputs
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000',
    backgroundColor: '#fff',
  },
  
  // Links
  link: {
    color: '#6b5cdb',
    fontWeight: '600',
  },
  
  // Containers
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  
  // Header
    Pageheader: {
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

// Export individual style objects for convenience
export const typography = {
  title: globalStyles.title,
  subtitle: globalStyles.subtitle,
  label: globalStyles.label,
};

export const colors = {
  primary: '#667EEA',
  secondary: '#6A3A9C',
  title:'#2D3748',
  text: '#000',
  textSecondary: '#666',
  border: '#E2E8F0',
  background: '#F8FAFC',
  placeholder: '#A0AEC0',
};
