import React, { ReactNode } from 'react';
import { View } from 'react-native';

interface PageContentProps {
  title: string;
  children: ReactNode;
}

function PageContent({ title, children }: PageContentProps) {
  return (
    <View>
      <h1>{title}</h1>
      {children}
    </View>
  );
}

export default PageContent;

