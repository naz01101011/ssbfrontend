import Client from '../components/Client'
import { createImageUrlBuilder } from '@sanity/image-url'

const builder = createImageUrlBuilder(Client)

const urlFor = source => {
    return builder.image(source)
}

export default urlFor;
