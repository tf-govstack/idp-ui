const Error404 = ({ message }) => {
    return (
        <div role="status" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
        }}>
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                <h1>{message} : 404 NOT FOUND</h1>
            </div>
        </div>
    );
};


const Error500 = () => {
    return (
        <div role="status" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
        }}>
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                <h1>500 INTERNAL SERVER ERROR</h1>
            </div>
        </div>
    );
};


export { Error404, Error500 };