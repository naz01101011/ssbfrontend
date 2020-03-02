import Client from '../components/Client'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(Client)

const urlFor = source => {
    return builder.image(source)
}

export default urlFor;