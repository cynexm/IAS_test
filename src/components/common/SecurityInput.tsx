import { InputAdornment, Paper } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import { createStyles, withStyles } from '@material-ui/core/styles'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import Downshift from 'downshift'
import React from 'react'
import { Field } from 'redux-form'
import { from, Observable, of, Subject } from 'rxjs'
import { debounceTime, switchMap } from 'rxjs/operators'
import { Currency, CurrencyOption, Security } from '../../core/model'
import { EnvConfig } from '../../environment'
import { translate } from 'react-admin'

// const useStyles = makeStyles((theme: Theme) =>
const styles = createStyles(theme => ({
  root: {
    // flexGrow: 1,
    // height: 250
  },
  container: {
    display: 'inline-flex',
    flexGrow: 1,
    position: 'relative'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    top: theme.spacing.unit * 5 + 'px',
    marginTop: theme.spacing.unit * 1 + 'px',
    left: 0,
    right: 0
  },
  chip: {
    margin: `${theme.spacing.unit * 0.5}px ${theme.spacing.unit * 0.25}px`
  },
  inputRoot: {
    minWidth: '256px',
    flexWrap: 'wrap'
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1
  },
  divider: {
    height: theme.spacing.unit * 2
  }
}))
// );

type Suggestion = Security

const suggestions: Suggestion[] = []

type RenderInputProps = TextFieldProps & {
  classes: any
  ref?: React.Ref<HTMLDivElement>
}

const renderInput = (inputProps: any) => {
  const { InputProps, classes, ref, ...other } = inputProps
  console.debug('Render Input: ', inputProps)
  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
      }}
      {...other}
    />
  )
}

interface RenderSuggestionProps {
  highlightedIndex: number | null
  index: number
  itemProps: any
  selectedItem: null | Suggestion
  hitText: string
  suggestion: Suggestion
}

function HighlightText({ fullText = '', hitText = '' }: { fullText: string; hitText: string }) {
  const idxOfHit = fullText.indexOf(hitText.toUpperCase())
  if (idxOfHit === -1) {
    return <span>{fullText}</span>
  }
  return (
    <span>
      {fullText.substring(0, idxOfHit)}
      <span style={{ color: 'red' }}>{hitText.toUpperCase()}</span>
      {fullText.substring(idxOfHit + hitText.length)}
    </span>
  )
}

function renderSuggestion({
  highlightedIndex,
  index,
  hitText,
  itemProps,
  selectedItem,
  suggestion
}: RenderSuggestionProps) {
  const isHighlighted = highlightedIndex === index
  const isSelected = selectedItem && selectedItem.id === suggestion.id

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.id}
      selected={isSelected}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <HighlightText fullText={suggestion.ticker} hitText={hitText} />
      <HighlightText fullText={suggestion.name} hitText={hitText} />
      <span>
        <small>{suggestion.currency}</small>
      </span>
    </MenuItem>
  )
}

const getSuggestions$ = new Subject<string>()
const suggestions$ = getSuggestions$.pipe(
  debounceTime(80),
  switchMap<string, Observable<Suggestion[]>>(query =>
    !query || !query.length
      ? of([])
      : from(fetch(EnvConfig.Apis.stockSearch(query)).then(res => res.json()))
  )
)

const { useState, useEffect } = React
export const AutoCompleteText = translate(
  withStyles(styles)(({ onSecuritySelected, classes, meta, translate, ...props }: any) => {
    // const classes = useStyles();

    const [suggestions, setSuggestions] = useState<Suggestion[] | undefined>(undefined)
    const [searchText, setSearch] = useState<string>('')
    const [currentSecurity, setCurrentSecurity] = useState<Security | undefined>(undefined)
    const [selectedItemFinal, setSelectedItemFinal] = useState<Suggestion | undefined>()
    useEffect(() => {
      suggestions$.subscribe(setSuggestions)
    }, [])
    const setSelected = (security: Security | undefined) => {
      let { dispatch } = meta
      if (!security) {
        return
      }
      dispatch({
        type: '@@redux-form/CHANGE',
        meta: {
          form: props.formName,
          field: props.syncFieldName,
          touch: false,
          persistentSubmitErrors: false
        },
        payload: security.id
      })
      setCurrentSecurity(security)
      if (onSecuritySelected) {
        props.input.onChange(security && security.id)
        onSecuritySelected(security)
      }
    }
    return (
      <div className={classes.root}>
        <Downshift
          id="downshift-simple"
          onSelect={item => {
            if (item === null || item === undefined) {
              return
            }
            console.log('OnSelect: ', item)
            const selectedItem = suggestions && suggestions.find(sug => sug.ticker === item)
            setSelectedItemFinal(selectedItem)
            setSelected(selectedItem)
            setSearch(item.ticker)
          }}
        >
          {({
            getInputProps,
            getItemProps,
            getLabelProps,
            getMenuProps,
            highlightedIndex,
            inputValue,
            isOpen,
            selectedItem
          }) => {
            const { onBlur, onFocus, ...inputProps } = getInputProps({
              placeholder: translate('common.search')
            })

            return (
              <div className={classes.container}>
                {renderInput({
                  // fullWidth: true,
                  classes,
                  label: translate('common.asset'),
                  InputLabelProps: getLabelProps({ shrink: true } as any),
                  InputProps: {
                    onBlur,
                    onFocus,
                    name: 'security',
                    onKeyUp: async e => {
                      const text = (e.target as any).value
                      setSearch(text)
                      // setSelectedItemFinal(undefined);
                      getSuggestions$.next(text)
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        {selectedItemFinal && selectedItemFinal.name}
                      </InputAdornment>
                    )
                  },
                  value: searchText,
                  autoFocus: props.autoFocus,
                  inputProps
                })}
                <div {...getMenuProps()}>
                  {isOpen ? (
                    <Paper className={classes.paper} square>
                      {searchText && suggestions && !suggestions.length && (
                        <MenuItem style={{ textAlign: 'center', fontSize: 12 }}>
                          {!isNaN(+searchText) && searchText.length > 4 && searchText.length < 7
                            ? translate('common.contact_admin')
                            : translate('common.no_record')}
                        </MenuItem>
                      )}
                      {suggestions !== undefined &&
                        suggestions.map((suggestion, index) =>
                          renderSuggestion({
                            suggestion,
                            index,
                            hitText: inputValue || '',
                            itemProps: getItemProps({
                              item: suggestion.ticker
                            }),
                            highlightedIndex,
                            selectedItem
                          })
                        )}
                    </Paper>
                  ) : null}
                </div>
              </div>
            )
          }}
        </Downshift>
      </div>
    )
  })
)
export function SecurityInput(props) {
  return <Field name={props.name} component={AutoCompleteText} {...props} />
}
