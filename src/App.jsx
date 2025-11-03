import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useWalletClient } from 'wagmi'
import { ethers } from 'ethers'
import { useEffect, useRef, useState } from 'react'
import abiJson from './contracts/Web3EduDAOInvite.abi.json'
import profileImage from './assets/dimi.jpeg'

// contract constants (keep here or move to separate file if you prefer)
const NFT_CONTRACT_ADDRESS = '0x6BDe3708d5A92A7B5ef3d409Ffb2b30f49243240'
const NFT_ABI = abiJson

const LANGUAGE_OPTIONS = {
  el: { label: 'Ελληνικά', abbr: 'ΕΛ' },
  en: { label: 'English', abbr: 'EN' },
}

const COPY = {
  el: {
    languageLabel: 'Γλώσσα',
    themeLight: 'Φωτεινό θέμα',
    themeDark: 'Σκοτεινό θέμα',
    heroEyebrow: 'Πρόσκληση Μέλους',
    heroTitle: 'Απόκτησε την πρόσκληση για το Web3Edu DAO',
    heroSubtitle: 'Διεκδίκησε το αποκλειστικό σου token και γίνε μέλος της επόμενης γενιάς Web3 εκπαίδευσης με αποδείξιμη συμμετοχή.',
    connectWallet: 'Σύνδεσε Πορτοφόλι',
    connectHelper: 'Σύνδεσε το πορτοφόλι σου για να επιβεβαιώσεις την επιλεξιμότητα και να κάνεις mint το μη μεταβιβάσιμο NFT της πρόσκλησης.',
    wrongNetwork: 'Λάθος δίκτυο',
    mintStatusIdle: 'Το πορτοφόλι συνδέθηκε. Κάνε mint την πρόσκληση για να γίνεις ενεργό μέλος.',
    mintStatusSuccess: 'Έχεις ήδη κάνει mint την πρόσκλησή σου — δες τα παρακάτω links.',
    benefitsAriaLabel: 'Πλεονεκτήματα συμμετοχής',
    mintCallToAction: 'Mint NFT',
    mintingLabel: 'Γίνεται Mint…',
    mintedLabel: 'Έγινε Mint',
    mintedPreviewHeading: 'Το Soulbound NFT σου',
    mintedPreviewLoading: 'Φόρτωση προεπισκόπησης NFT…',
    mintedPreviewFallback: 'Η προεπισκόπηση δεν είναι διαθέσιμη αυτή τη στιγμή. Άνοιξε τα links για λεπτομέρειες.',
    viewNft: '🔍 Δες το NFT σου στο Blockscout',
    viewMintedToken: (tokenId) => `🖼️ Δες το minted NFT (ID ${tokenId})`,
    alertAlreadyMinted: 'Έχεις ήδη κάνει mint το NFT!',
    alertMintSuccess: (tokenId, explorerLink) =>
      `✅ Το NFT κόπηκε με επιτυχία!\n\n${tokenId ? `Token ID: ${tokenId}\n\n` : ''}Δες τη συναλλαγή:\n${explorerLink}`,
    alertMintFailed: '⚠️ Η διαδικασία mint απέτυχε:',
    footerHeading: 'Επικοινωνία',
    footerEmailLabel: 'Email',
    footerLinkedInLabel: 'LinkedIn',
  },
  en: {
    languageLabel: 'Language',
    themeLight: 'Light mode',
    themeDark: 'Dark mode',
    heroEyebrow: 'Soulbound Membership',
    heroTitle: 'Claim your Web3Edu DAO invite',
    heroSubtitle: 'Secure your invite token and join the next generation of Web3 education with verifiable participation.',
    connectWallet: 'Connect Wallet',
    connectHelper: 'Connect your wallet to verify eligibility and mint your non-transferable invite NFT.',
    wrongNetwork: 'Wrong network',
    mintStatusIdle: 'Wallet connected. Mint your invite to become an active member.',
    mintStatusSuccess: 'You have already minted your invite — explore the links below.',
    benefitsAriaLabel: 'Membership benefits',
    mintCallToAction: 'Mint NFT',
    mintingLabel: 'Minting…',
    mintedLabel: 'Minted',
    mintedPreviewHeading: 'Your Soulbound NFT',
    mintedPreviewLoading: 'Loading NFT preview…',
    mintedPreviewFallback: 'Preview unavailable right now. Use the links below to inspect your token.',
    viewNft: '🔍 View your NFT on Blockscout',
    viewMintedToken: (tokenId) => `🖼️ View minted NFT (ID ${tokenId})`,
    alertAlreadyMinted: 'You have already minted the NFT!',
    alertMintSuccess: (tokenId, explorerLink) =>
      `✅ NFT minted successfully!\n\n${tokenId ? `Token ID: ${tokenId}\n\n` : ''}View transaction:\n${explorerLink}`,
    alertMintFailed: '⚠️ Minting failed:',
    footerHeading: 'Contact',
    footerEmailLabel: 'Email',
    footerLinkedInLabel: 'LinkedIn',
  },
}

const BENEFITS_BY_LANGUAGE = {
  el: [
    {
      icon: '🧠',
      title: 'Επιμελημένα Μονοπάτια Μάθησης',
      description: 'Πρόσβαση σε εργαστήρια, Q&As και πόρους από την κοινότητα για την επόμενη γενιά Web3 builders.',
    },
    {
      icon: '🤝',
      title: 'Επαληθευμένη Συμμετοχή',
      description: 'Το soulbound invite αποδεικνύει on-chain την ταυτότητά σου και κρατά τη συμμετοχή σου προστατεύοντας την από τυχόν επιθέσεις.',
    },
    {
      icon: '🚀',
      title: 'Πρόσβαση σε Launchpad',
      description: 'Λάβε πρώιμες ματιές σε projects, προτάσεις governance και events του DAO μαζί με άλλα μέλη.',
    },
  ],
  en: [
    {
      icon: '🧠',
      title: 'Curated Learning Tracks',
      description: 'Access community-led workshops, Q&As, and resources tailored to the next wave of Web3 builders.',
    },
    {
      icon: '🤝',
      title: 'Verified Membership',
      description: 'Soulbound invite proves your identity on-chain, keeping participation seamless and sybil-resistant.',
    },
    {
      icon: '🚀',
      title: 'Launchpad Access',
      description: 'Get first looks at DAO projects, governance proposals, and IRL events with fellow members.',
    },
  ],
}

function App({ isDarkMode, onToggleDarkMode }) {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [language, setLanguage] = useState('el')
  const [isMinting, setIsMinting] = useState(false)
  const [hasMinted, setHasMinted] = useState(false)
  const [mintedTokenId, setMintedTokenId] = useState(null)
  const [mintedMetadata, setMintedMetadata] = useState(null)
  const [showMintCelebration, setShowMintCelebration] = useState(false)
  const celebrationTimeoutRef = useRef(null)
  const t = COPY[language]
  const benefits = BENEFITS_BY_LANGUAGE[language]
  const resolveResourceUri = (uri) => {
    if (!uri) return null
    if (uri.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${uri.slice(7)}`
    }
    if (uri.startsWith('ipfs/')) {
      return `https://ipfs.io/ipfs/${uri.slice(5)}`
    }
    return uri
  }

  const handleMint = async () => {
    if (!address || typeof window === 'undefined' || !window.ethereum) return

    try {
      setIsMinting(true)
      setMintedMetadata(null)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer)

      const alreadyMinted = await contract.hasMinted(address)
      if (alreadyMinted) {
        alert(t.alertAlreadyMinted)
        setHasMinted(true)
        return
      }

      const tx = await contract.mint()
      const receipt = await tx.wait()

      // parse Transfer log for tokenId (safe generic approach)
      let tokenId = null
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log)
          if (parsed?.name === 'Transfer') {
            tokenId = parsed.args.tokenId.toString()
            break
          }
        } catch (err) {
          // not the right log, continue
        }
      }

      setMintedTokenId(tokenId)
      const explorerLink = `https://blockexplorer.dimikog.org/tx/${tx.hash}`
      console.log('Transaction hash:', tx.hash)
      alert(t.alertMintSuccess(tokenId, explorerLink))
      setHasMinted(true)
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current)
      }
      setShowMintCelebration(true)
      celebrationTimeoutRef.current = setTimeout(() => {
        setShowMintCelebration(false)
        celebrationTimeoutRef.current = null
      }, 2400)
    } catch (err) {
      console.error(err)
      alert(`${t.alertMintFailed}\n${err?.reason || err?.message || 'Unknown error'}`)
    } finally {
      setIsMinting(false)
    }
  }

  useEffect(() => {
    return () => {
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!mintedTokenId || typeof window === 'undefined' || !window.ethereum) {
      return
    }

    let cancelled = false
    setMintedMetadata({ status: 'loading' })

    const fetchMetadata = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const readOnlyContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, provider)
        const tokenUri = await readOnlyContract.tokenURI(BigInt(mintedTokenId))
        const resolvedTokenUri = resolveResourceUri(tokenUri)

        if (!resolvedTokenUri) {
          throw new Error('Token URI is empty')
        }

        const response = await fetch(resolvedTokenUri)
        if (!response.ok) {
          throw new Error(`Failed to load metadata (${response.status})`)
        }

        const metadataJson = await response.json()
        const resolvedImage = resolveResourceUri(metadataJson.image || metadataJson.image_url)

        if (!cancelled) {
          setMintedMetadata({
            status: 'success',
            data: {
              image: resolvedImage,
              name: metadataJson.name,
              description: metadataJson.description,
            },
          })
        }
      } catch (error) {
        console.error('Failed to fetch token metadata', error)
        if (!cancelled) {
          setMintedMetadata({ status: 'error' })
        }
      }
    }

    fetchMetadata()

    return () => {
      cancelled = true
    }
  }, [mintedTokenId])

  return (
    <div className="app-shell">
      <div className="interface-toggles">
        <div className="language-toggle" role="group" aria-label={t.languageLabel}>
          {Object.entries(LANGUAGE_OPTIONS).map(([code, option]) => (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              className={`language-chip ${language === code ? 'is-active' : ''}`}
              aria-pressed={language === code}
              aria-label={option.label}
              title={option.label}
            >
              {option.abbr}
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-pressed={isDarkMode}
          onClick={onToggleDarkMode}
          className="theme-toggle-button"
        >
          <span role="img" aria-hidden="true">
            {isDarkMode ? '🌞' : '🌙'}
          </span>
          <span>{isDarkMode ? t.themeLight : t.themeDark}</span>
        </button>
      </div>

      <main className="app-content">
        <section className="hero-card">
          <div className="hero-copy">
            <span className="hero-eyebrow">{t.heroEyebrow}</span>
            <h1 className="hero-title">{t.heroTitle}</h1>
            <p className="hero-subtitle">{t.heroSubtitle}</p>
          </div>

          <div className="cta-stack">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const connected = mounted && account && chain;

                return (
                  <div
                    {...(!mounted && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="connect-cta"
                          >
                            {t.connectWallet}
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button onClick={openChainModal} type="button" className="chain-pill chain-pill--alert">
                            {t.wrongNetwork}
                          </button>
                        );
                      }

                      return (
                        <div className="connected-stack">
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="chain-pill"
                          >
                            {chain.iconUrl ? (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 14, height: 14 }}
                              />
                            ) : null}
                            {chain.name}
                          </button>

                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="wallet-pill"
                          >
                            {account.displayName}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>

            {!isConnected && (
              <p className="cta-helper">
                {t.connectHelper}
              </p>
            )}
          </div>

          {isConnected && (
            <div className="mint-panel">
              <p className={`mint-status ${hasMinted ? 'mint-status--success' : 'mint-status--muted'}`}>
                {hasMinted
                  ? t.mintStatusSuccess
                  : t.mintStatusIdle}
              </p>

              <button
                onClick={handleMint}
                disabled={isMinting || hasMinted}
                className={`mint-button ${hasMinted ? 'is-minted' : isMinting ? 'is-minting' : ''}`}
              >
                <span className="inline-flex items-center gap-3" aria-live="polite">
                  {isMinting ? (
                    <>
                      <span className="mint-spinner" aria-hidden="true" />
                      <span>{t.mintingLabel}</span>
                    </>
                  ) : (
                    <>
                      <span aria-hidden>{hasMinted ? '✅' : '🎁'}</span>
                      <span>{hasMinted ? t.mintedLabel : t.mintCallToAction}</span>
                    </>
                  )}
                </span>
              </button>

              {hasMinted && (
                <>
                  <div className={`mint-celebration ${showMintCelebration ? 'is-active' : ''}`} aria-hidden="true">
                    {Array.from({ length: 7 }).map((_, index) => (
                      <span key={index} className={`mint-celebration__piece mint-celebration__piece--${index + 1}`} />
                    ))}
                    <span className="mint-celebration__glow" />
                  </div>

                  <div className="mint-artwork" aria-live="polite">
                    <div className="mint-artwork__frame">
                      {mintedMetadata?.status === 'success' && mintedMetadata.data?.image ? (
                        <img
                          src={mintedMetadata.data.image}
                          alt={mintedMetadata.data?.name || t.mintedPreviewHeading}
                          loading="lazy"
                        />
                      ) : (
                        <div className={`mint-artwork__placeholder ${mintedMetadata?.status === 'loading' ? 'is-loading' : ''}`}>
                          <span>
                            {mintedMetadata?.status === 'loading'
                              ? t.mintedPreviewLoading
                              : t.mintedPreviewFallback}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mint-artwork__meta">
                      <h4>{t.mintedPreviewHeading}</h4>
                      {mintedMetadata?.status === 'success' && mintedMetadata.data?.name && (
                        <p className="mint-artwork__title">{mintedMetadata.data.name}</p>
                      )}
                      {mintedMetadata?.status === 'success' && mintedMetadata.data?.description && (
                        <p className="mint-artwork__description">{mintedMetadata.data.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="mint-links">
                    <a
                      href={`https://blockexplorer.dimikog.org/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mint-link"
                    >
                      {t.viewNft}
                    </a>

                    {mintedTokenId && (
                      <a
                        href={`https://blockexplorer.dimikog.org/token/${NFT_CONTRACT_ADDRESS}?a=${mintedTokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mint-link"
                      >
                        {t.viewMintedToken(mintedTokenId)}
                      </a>
                    )}
                  </div>

                  {/* Return to Web3Edu button */}
                  <a
                    href="https://web3edu.dimikog.org/"
                    className="return-link return-link--card"
                  >
                    <span aria-hidden="true" className="return-link__icon">←</span>
                    <span>Επιστροφή στο Web3Edu</span>
                  </a>

                  {/* Invite form block - improved, light/dark theme adaptive */}
                  <div className="invite-section">
                    <p className="invite-section__intro">
                      📬 Συμπλήρωσε τη φόρμα για να σε προσκαλέσουμε στο <span className="invite-section__highlight">Web3Edu DAO</span>
                    </p>
                    <a
                      href="https://forms.gle/FcZBWCm6o8cBDT3Z6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="invite-cta"
                    >
                      <span className="invite-cta__icon invite-cta__icon--lead" aria-hidden="true">✨</span>
                      <span className="invite-cta__label">Γίνε Μέλος Σήμερα</span>
                      <span className="invite-cta__icon invite-cta__icon--trail" aria-hidden="true">🚀</span>
                    </a>
                    <p className="invite-section__note">
                      Θέσεις περιορισμένες — θα σου στείλουμε πρόσκληση άμεσα.
                    </p>
                    <div className="invite-section__return">
                      <a
                        href="https://web3edu.dimikog.org/"
                        className="return-link return-link--text"
                      >
                        <span aria-hidden="true" className="return-link__icon">←</span>
                        <span>Επιστροφή στο Web3Edu</span>
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        <section className="feature-grid" aria-label={t.benefitsAriaLabel}>
          {benefits.map(({ icon, title, description }) => (
            <article key={title} className="feature-card">
              <span className="feature-icon" aria-hidden="true">{icon}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </section>
      </main>
      <footer className="app-footer" role="contentinfo">
        <div className="app-footer__content">
          <img
            className="app-footer__avatar"
            src={profileImage}
            alt="Dimitris Kogias"
            loading="lazy"
          />
          <span className="app-footer__label">{t.footerHeading}</span>
          <div className="app-footer__links">
            <a className="app-footer__link" href="mailto:dimitris@kogias.eu">
              {t.footerEmailLabel}: dimitris@kogias.eu
            </a>
            <a
              className="app-footer__link"
              href="https://www.linkedin.com/in/dimitris-kogias-b376222a/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.footerLinkedInLabel}: linkedin.com/in/dimitris-kogias-b376222a/
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
