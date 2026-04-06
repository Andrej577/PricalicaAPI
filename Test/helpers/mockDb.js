const query = jest.fn();
const getConnection = jest.fn();
const end = jest.fn();
const testConnection = jest.fn();

function createConnection() {
    return {
        beginTransaction: jest.fn(),
        query: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
    };
}

const defaultConnection = createConnection();
getConnection.mockResolvedValue(defaultConnection);

function resetAll() {
    query.mockReset();
    getConnection.mockReset();
    end.mockReset();
    testConnection.mockReset();

    defaultConnection.beginTransaction.mockReset();
    defaultConnection.query.mockReset();
    defaultConnection.commit.mockReset();
    defaultConnection.rollback.mockReset();
    defaultConnection.release.mockReset();

    getConnection.mockResolvedValue(defaultConnection);
}

module.exports = {
    pool: {
        query,
        getConnection,
        end,
    },
    testConnection,
    __mocks: {
        query,
        getConnection,
        end,
        testConnection,
        defaultConnection,
        createConnection,
        resetAll,
    },
};
