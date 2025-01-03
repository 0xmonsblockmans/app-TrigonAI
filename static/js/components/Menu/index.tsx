// eslint-disable-next-line no-restricted-imports
import { t, Trans } from '@lingui/macro'
import { LOCALE_LABEL, SUPPORTED_LOCALES, SupportedLocale } from 'constants/locales'
import { useActiveLocale } from 'hooks/useActiveLocale'
import { useLocationLinkProps } from 'hooks/useLocationLinkProps'
import React, { useEffect, useRef, useState } from 'react'
import {
  BookOpen,
  Check,
  ChevronLeft,
  Code,
  ExternalLink as ExternalLinkIcon,
  Globe,
  Info,
  MessageCircle,
  Moon,
  Sun,
} from 'react-feather'
import { Link } from 'react-router-dom'
import { useDarkModeManager } from 'state/user/hooks'
import styled, { css } from 'styled-components/macro'

import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { ExternalLink } from '../../theme'

export enum FlyoutAlignment {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

const StyledMenuIcon = styled(MenuIcon)`
  height: 20px;
  width: 20px;

  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => (theme.darkMode ? theme.bg2 : theme.bg3)};
  border: 2px solid ${({ theme }) => (theme.darkMode ? theme.bg3 : theme.bg0)};
  border-radius: 20px;
  margin: 0;
  padding: 8px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => (theme.darkMode ? theme.bg2 : theme.bg0)};
    border: 2px solid ${({ theme }) => theme.bg3};

    path {
      stroke: ${({ theme }) => theme.text1};
    }
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0.5rem;
  `};
`

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span<{ flyoutAlignment?: FlyoutAlignment }>`
  min-width: 230px;
  max-height: 600px;
  overflow: auto;
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: 0 0 2px 2px ${({ theme }) => theme.shadow2};
  border: 1px solid ${({ theme }) => theme.bg1};
  border-radius: 20px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  position: absolute;
  top: 70px;
  z-index: 100;

  ${({ flyoutAlignment = FlyoutAlignment.RIGHT }) =>
    flyoutAlignment === FlyoutAlignment.RIGHT
      ? css`
          right: 0rem;
        `
      : css`
          left: 0rem;
        `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    bottom: unset;
    right: 0;
    left: unset;
  `};
`

const MenuItem = styled(ExternalLink)`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0.5rem;
  justify-content: space-between;
  color: ${({ theme }) => theme.text2};
  border-radius: 10px;

  :hover {
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg2};
    cursor: pointer;
    text-decoration: none;
  }
`

const InternalMenuItem = styled(Link)`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};

  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }

  > svg {
    margin-right: 8px;
  }
`

const InternalLinkMenuItem = styled(InternalMenuItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0.5rem;
  justify-content: space-between;
  text-decoration: none;

  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
`

const ToggleMenuItem = styled.button`
  background-color: transparent;
  margin: 0;
  border: none;
  border-radius: 10px;
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0.5rem;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text2};

  :hover {
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg2};
    cursor: pointer;
    text-decoration: none;
  }
`

const MenuDivider = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.bg2};
  margin: 8px 0;
`

const CODE_LINK = 'https://github.com/TrigonAI-Finance/interface'

function LanguageMenuItem({ locale, active, key }: { locale: SupportedLocale; active: boolean; key: string }) {
  const { to, onClick } = useLocationLinkProps(locale)

  if (!to) return null

  return (
    <InternalLinkMenuItem onClick={onClick} key={key} to={to}>
      <div>{LOCALE_LABEL[locale]}</div>
      {active && <Check opacity={0.6} size={16} />}
    </InternalLinkMenuItem>
  )
}

function LanguageMenu({ close }: { close: () => void }) {
  const activeLocale = useActiveLocale()

  return (
    <MenuFlyout>
      <ToggleMenuItem onClick={close}>
        <ChevronLeft size={16} />
      </ToggleMenuItem>
      {SUPPORTED_LOCALES.map((locale) => (
        <LanguageMenuItem locale={locale} active={activeLocale === locale} key={locale} />
      ))}
    </MenuFlyout>
  )
}

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)
  const [darkMode, toggleDarkMode] = useDarkModeManager()
  const [menu, setMenu] = useState<'main' | 'lang'>('main')

  useEffect(() => {
    setMenu('main')
  }, [open])

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle} aria-label={t`Menu`}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {open &&
        (() => {
          switch (menu) {
            case 'lang':
              return <LanguageMenu close={() => setMenu('main')} />
            case 'main':
            default:
              return (
                <MenuFlyout>
                  <MenuItem href="https://TrigonAI.finance/">
                    <div>
                      <Trans>About</Trans>
                    </div>
                    <Info opacity={0.6} size={16} />
                  </MenuItem>              
                  <ToggleMenuItem onClick={() => setMenu('lang')}>
                    <div>
                      <Trans>Language</Trans>
                    </div>
                    <Globe opacity={0.6} size={16} />
                  </ToggleMenuItem>
                  <ToggleMenuItem onClick={() => toggleDarkMode()}>
                    <div>{darkMode ? <Trans>Light Theme</Trans> : <Trans>Dark Theme</Trans>}</div>
                    {darkMode ? <Moon opacity={0.6} size={16} /> : <Sun opacity={0.6} size={16} />}
                  </ToggleMenuItem>
                  <MenuDivider />                                
                </MenuFlyout>
              )
          }
        })()}
    </StyledMenu>
  )
}

interface NewMenuProps {
  flyoutAlignment?: FlyoutAlignment
  ToggleUI?: React.FunctionComponent
  menuItems: {
    content: any
    link: string
    external: boolean
  }[]
}

const NewMenuFlyout = styled(MenuFlyout)`
  top: 3rem !important;
`
const NewMenuItem = styled(InternalMenuItem)`
  width: max-content;
  text-decoration: none;
`

const ExternalMenuItem = styled(MenuItem)`
  width: max-content;
  text-decoration: none;
`

export const NewMenu = ({ flyoutAlignment = FlyoutAlignment.RIGHT, ToggleUI, menuItems, ...rest }: NewMenuProps) => {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.POOL_OVERVIEW_OPTIONS)
  const toggle = useToggleModal(ApplicationModal.POOL_OVERVIEW_OPTIONS)
  useOnClickOutside(node, open ? toggle : undefined)
  const ToggleElement = ToggleUI || StyledMenuIcon
  return (
    <StyledMenu ref={node as any} {...rest}>
      <ToggleElement onClick={toggle} />
      {open && (
        <NewMenuFlyout flyoutAlignment={flyoutAlignment}>
          {menuItems.map(({ content, link, external }, i) =>
            external ? (
              <ExternalMenuItem href={link} key={i}>
                {content}
              </ExternalMenuItem>
            ) : (
              <NewMenuItem to={link} key={i}>
                {content}
              </NewMenuItem>
            )
          )}
        </NewMenuFlyout>
      )}
    </StyledMenu>
  )
}
