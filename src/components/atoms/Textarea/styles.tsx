import styled from 'styled-components';

interface StyledTextareaProps {
  $error?: boolean;
  $disabled?: boolean;
}

export const TextareaContainer = styled.div``;

export const StyledTextarea = styled.textarea<StyledTextareaProps>``;

export const HelperText = styled.span``;

export const CharacterCount = styled.span``;
