import { Link } from "react-router-dom";
function NotFoundPage() {
	return (
		<div className="flex flex-col gap-4 text-9xl text-amber-200 opacity-55">
			<div>
				<p className="text-9xl">AAAAA</p>404 Not Found
			</div>
			<Link to="/">Home</Link>
		</div>
	);
}
export default NotFoundPage;
