import Network from './Network'
import Address from './Address'
import { BigNumber, Contract } from 'ethers'

type TokenProps = {
  symbol: string
  tokenName: string
  imageUrl: string
  decimals?: number
  contracts: { [key: string]: Contract | undefined }
  supportedNetworks?: string[]
}

class Token {
  readonly symbol: string
  readonly tokenName: string
  readonly decimals: number
  readonly imageUrl: string
  readonly contracts: { [key: string]: Contract | undefined }
  readonly addresses: { [key: string]: Address } = {}
  readonly supportedNetworks: string[] = []

  constructor (props: TokenProps) {
    this.symbol = props.symbol
    this.tokenName = props.tokenName
    this.imageUrl = props.imageUrl
    this.decimals = props.decimals || 18
    this.contracts = props.contracts
    this.supportedNetworks = props.supportedNetworks || []
    Object.keys(props.contracts).forEach(key => {
      const contract = props.contracts[key]
      if (contract) {
        this.addresses[key] = new Address(contract.address)
      }
    })
  }

  networkSymbol (network: Network | undefined) {
    const prefix = network?.slug || ''
    return prefix + '.' + this.symbol
  }

  contractForNetwork (network: Network): Contract {
    const contract = this.contracts[network.slug]
    if (!contract) {
      throw new Error(`No token contract for Network '${network.name}'`)
    }

    return contract
  }

  addressForNetwork (network: Network): Address {
    return new Address(this.contractForNetwork(network).address)
  }

  rateForNetwork (network: Network | undefined): BigNumber {
    // TOD: fetch rates
    return BigNumber.from('0')
  }
}

export default Token
