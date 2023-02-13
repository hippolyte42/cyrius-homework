import {
    AutocompleteGetTagProps,
    useAutocomplete,
} from '@mui/base/AutocompleteUnstyled'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { autocompleteClasses } from '@mui/material/Autocomplete'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import { User, UserInputs } from '../../types/types'

const Root = styled('div')(
    ({ theme }: any) => `
  color: ${
      theme.palette.mode === 'dark'
          ? 'rgba(255,255,255,0.65)'
          : 'rgba(0,0,0,.85)'
  };
  font-size: 14px;
`
)

const InputWrapper = styled('div')(
    ({ theme }: any) => `
  border: 1px solid ${theme.palette.mode === 'dark' ? '#434343' : '#d9d9d9'};
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
  }

  &.focused {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
    color: ${
        theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.65)'
            : 'rgba(0,0,0,.85)'
    };
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`
)

interface TagProps extends ReturnType<AutocompleteGetTagProps> {
    label: string
}

function Tag(props: TagProps) {
    const { label, onDelete, ...other } = props
    return (
        <div {...other}>
            <span>{label}</span>
            <CloseIcon onClick={onDelete} />
        </div>
    )
}

const StyledTag = styled(Tag)<TagProps>(
    ({ theme }: any) => `
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  background-color: ${
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fafafa'
  };
  border: 1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#e8e8e8'};
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`
)

const Listbox = styled('ul')(
    ({ theme }) => `
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${theme.palette.mode === 'dark' ? '#141414' : '#fff'};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: ${theme.palette.mode === 'dark' ? '#2b2b2b' : '#fafafa'};
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`
)

interface LabelsComboBoxProps {
    isFormReadOnly: boolean
    selectedUserLabelsInput: string[]
    setInputs: React.Dispatch<React.SetStateAction<UserInputs | undefined>>
    selectedUser: User | undefined
}

export default function LabelsComboBox({
    isFormReadOnly,
    selectedUserLabelsInput,
    setInputs,
}: LabelsComboBoxProps) {
    const {
        getRootProps,
        getInputProps,
        getTagProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        value,
        setAnchorEl,
    } = useAutocomplete({
        id: 'cyrius-labels-combobox',
        value: selectedUserLabelsInput,
        multiple: true,
        options: selectedUserLabelsInput || [],
        getOptionLabel: (option) => option,
        freeSolo: true,
        onChange: (event, newValue) => {
            handleChange(event, newValue)
        },
    })

    const handleChange = (
        _event: React.SyntheticEvent<Element, Event>,
        newValue: string[]
    ) => {
        const name: keyof UserInputs = 'labels'
        const value = newValue
        setInputs((values: React.SetStateAction<UserInputs | undefined>) => ({
            ...values,
            [name]: value,
        }))
    }

    return (
        <Root>
            <div className="md:flex md:items-center mb-6" {...getRootProps()}>
                <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 text-base">
                        Labels
                    </label>
                </div>
                <div className="md:w-2/3">
                    <InputWrapper ref={setAnchorEl}>
                        {value.map((option: string, index: number) =>
                            isFormReadOnly ? (
                                <StyledTag
                                    label={option}
                                    {...getTagProps({ index })}
                                    onDelete={() =>
                                        console.log(
                                            "can't delete label in read only mode"
                                        )
                                    }
                                />
                            ) : (
                                <StyledTag
                                    label={option}
                                    {...getTagProps({ index })}
                                />
                            )
                        )}
                        <input readOnly={isFormReadOnly} {...getInputProps()} />
                    </InputWrapper>
                    {groupedOptions.length > 0 && !isFormReadOnly ? (
                        <Listbox {...getListboxProps()}>
                            {(
                                groupedOptions as typeof selectedUserLabelsInput
                            ).map((option, index) => (
                                <li {...getOptionProps({ option, index })}>
                                    <span>{option}</span>
                                    <CheckIcon fontSize="small" />
                                </li>
                            ))}
                        </Listbox>
                    ) : null}
                    {/* <input
                        className={`${
                            isFormReadOnly ? '' : 'focus:bg-white'
                        } bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none  focus:border-blue-500`}
                        type="text"
                        placeholder={selectedUser?.labels}
                        readOnly={isFormReadOnly}
                        name="labels"
                        onChange={handleChange}
                        value={inputs?.labels || ''}
                    /> */}
                </div>
            </div>
        </Root>
    )
}
