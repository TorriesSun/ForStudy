import styled from 'styled-components';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

interface DefaultLayoutProps {
	children: React.ReactNode;
}

const Container = styled.div`
	background-image: url('/images/beams.jpg');
	background-position: center;
	min-height: 100vh;
	overflow: hidden;
`;

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => (
	<Container>
		<Header />
		<main>{children}</main>
		<Footer />
	</Container>
);

export default DefaultLayout;
