import PercentIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PercentIcon />', () => {
  it('should render PercentIcon', () => {
    const { container } = renderWithTheme(
      <PercentIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});