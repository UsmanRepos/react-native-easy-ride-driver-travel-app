import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Animated, Keyboard, ScrollView } from 'react-native'
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux'
import { CancelledRides, CompletedRides, LineDivider, UpComingRides } from '../components'
import { COLORS, SIZES, FONTS, icons } from '../constants'

const promo_tabs = [
  {
      id: 1,
      title: "Coming",
  },
  {
      id: 2,
      title: "Completed",
  },
  {
      id: 3,
      title: "Cancelled",
  },
]

const promoTabs = promo_tabs.map((promoTab) => ({
  ...promoTab,
  ref: createRef()
}));

const TabIndicator = ({ measureLayout, scrollX }) => {

  const inputRange = promoTabs.map((_, i) => SIZES.width * i);

  const tabIndicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measureLayout.map(measure => measure.width),
  });

  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measureLayout.map(measure => measure.x)
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: 0,
        width: tabIndicatorWidth,
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        transform: [
          {
            translateX: translateX
          }
        ]
      }}
    />
  );
};

const Tabs = ({ appTheme, scrollX, onTabPress }) => {
  const [measureLayout, setMeasureLayout] = useState([])
  const containerRef = useRef()
  const tabPosition = Animated.divide(scrollX, SIZES.width)

  useEffect(() => {
    let ml = []
    promoTabs.forEach(promo => {
      promo?.ref?.current?.measureLayout(
        containerRef.current,
        (x, y, width, height) => {

          ml.push({
            x, y, width, height
          })

          if (ml.length === promoTabs.length) {
            setMeasureLayout(ml)
          }
        }
      );
    });

  }, [containerRef.current]);

  return (
    <View
      ref={containerRef}
      style={{
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 2,
        justifyContent: 'space-between',
        borderRadius: SIZES.radius,
        backgroundColor: appTheme?.backgroundColor
      }}
    >
      {/* Tab Indicator */}
      {measureLayout.length > 0 &&
        <TabIndicator
          measureLayout={measureLayout}
          scrollX={scrollX}
        />
      }


      {/* Tab */}
      {
        promoTabs.map((item, index) => {

          const textColor = tabPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [COLORS.gray50, COLORS.white, COLORS.gray50],
            extrapolate: 'clamp'
          });

          return (
            <TouchableOpacity
              ref={item?.ref}
              key={`PromoTab-${index}`}
              onPress={() => onTabPress(index)}
            >
              <View
                style={{
                  height: 60,
                  paddingHorizontal: 15,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Animated.Text style={{ color: textColor, ...FONTS.h3 }}>{item?.title}</Animated.Text>
              </View>
            </TouchableOpacity>
          )
        })
      }
    </View>
  );
};

const History = () => {

  const { appTheme } = useSelector((state) => state.themeReducer)
  const scrollX = useRef(new Animated.Value(0)).current
  const promoRef = useRef()


  const onTabPress = useCallback((tabIndex) => {
    promoRef?.current?.scrollToOffset({
      offset: tabIndex * SIZES.width
    })
  });

  const renderHeader = () => {
    return (
      <View
        style={{
          marginTop: 30,
          height: 58,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: SIZES.radius,
          backgroundColor: COLORS.primary
        }}
      >
        {/* Label / Title */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ ...FONTS.h1, color: COLORS.white, fontSize: 26 }}>Rides</Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center'
        }}
      >
        {/* Header - Tabs */}
        <Tabs
          appTheme={appTheme}
          scrollX={scrollX}
          onTabPress={onTabPress}
        />

        {/* Promo Details */}
        <Animated.FlatList
          ref={promoRef}
          horizontal
          pagingEnabled
          snapToAlignment={'center'}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          data={promoTabs}
          keyExtractor={item => `PromoDetail-${item.id}`}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { x: scrollX } } }
          ], {
            useNativeDriver: false
          })}
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  width: SIZES.width
                }}
              >
                {index == 0 && <UpComingRides />}
                {index == 1 && <CompletedRides />}
                {index == 2 && <CancelledRides />}
              </View>
            )
          }}

        />
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.gray10
      }}
    >
      {/* Header Bar */}
      {renderHeader()}

      <ScrollView
        style={{
          flex: 1
        }}
        contentContainerStyle={{
          paddingBottom: 150,
          paddingHorizontal: SIZES.radius
        }}
      >
        <View style={{ paddingTop: SIZES.padding, paddingBottom: SIZES.radius }}>
          <Text style={{ ...FONTS.h2 }}>History</Text>
        </View>
        {/* Content */}
        {renderContent()}
      </ScrollView>


    </View>
  )
}

export default History

const styles = StyleSheet.create({})

