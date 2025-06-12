import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native'

const ShopScreen = () => {
  const data = [
    {
      id: 1,
      title: 'Product 1',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/suvtrees-003.webp?alt=media&token=1b02009d-72d8-40ec-a2cd-a4d593d72d4b',
    },
    {
      id: 2,
      title: 'Product 2',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/shelby-american-muscle-cars-5893728-2560-1920.jpg?alt=media&token=18942b2a-687b-4000-8531-8c15b8d98832',
    },
    {
      id: 3,
      title: 'Product 3',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/best_car_wallpapers%201.jpeg?alt=media&token=190d41cd-46f4-4cc9-b6da-2582c6db9c08',
    },
    {
      id: 4,
      title: 'Product 4',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/47457.webp?alt=media&token=9d68e725-4fef-472f-bd1d-0b408ff24de1',
    },
    {
      id: 5,
      title: 'Product 5',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/NetBhB7.jpg?alt=media&token=87198ab1-ad04-4ea1-860e-d55e35da2bee',
    },
    {
      id: 6,
      title: 'Product 6',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/5-lamborghini-gallardo-car-wallpaper-1024x576.jpg?alt=media&token=ef54fa54-7ab8-4af1-bd03-86b68a30cbd6',
    },
    {
      id: 7,
      title: 'Product 7',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/e6f99cc790210cb3ea63bc2755e98550.jpg?alt=media&token=cd3b9dab-ed62-4657-82b1-889cdc2822c0',
    },
    {
      id: 8,
      title: 'Product 8',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/Bmw%20cars%20usa-2.jpg?alt=media&token=8d44a607-240c-4a13-8fe5-adee7827be72',
    },
    {
      id: 9,
      title: 'Product 9',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/suvtrees-003.webp?alt=media&token=1b02009d-72d8-40ec-a2cd-a4d593d72d4b',
    },
    {
      id: 9,
      title: 'Product 10',
      count: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/ziontimeline.appspot.com/o/dd9cdf7c2daead48c83ce0d8cbf42f1a.jpg?alt=media&token=0cdef31f-7e60-4791-b341-f2e979c48e35',
    },
  ]

  const [results, setResults] = useState(data)

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContainer}
        data={results}
        horizontal={false}
        numColumns={2}
        keyExtractor={item => {
          return item.id.toString()
        }}
        ItemSeparatorComponent={() => {
          return <View style={styles.separator} />
        }}
        renderItem={post => {
          const item = post.item
          return (
            <TouchableOpacity style={styles.card}>
              <View style={styles.imageContainer}>
                <Image style={styles.cardImage} source={{ uri: item.image }} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.count}>({item.count} Photos)</Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  list: {
    paddingHorizontal: 10,
  },
  listContainer: {
    alignItems: 'center',
  },
  separator: {
    marginTop: 10,
  },
  /******** card **************/
  card: {
    marginVertical: 8,
    backgroundColor: 'white',
    flexBasis: '45%',
    marginHorizontal: 10,
  },
  cardContent: {
    paddingVertical: 17,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  cardImage: {
    flex: 1,
    height: 150,
    width: null,
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  /******** card components **************/
  title: {
    fontSize: 18,
    flex: 1,
    color: '#778899',
  },
  count: {
    fontSize: 18,
    flex: 1,
    color: '#B0C4DE',
  },
})
export default ShopScreen;