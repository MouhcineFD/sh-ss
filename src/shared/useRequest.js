/* eslint-disable react-hooks/exhaustive-deps */
import { get, isEmpty, merge, set } from "lodash";
import { useEffect, useReducer, useRef } from "react";

import axios, { api } from "./http";

const CancelToken = axios.CancelToken;

const TYPES = Object.freeze({
  START: "START",
  START_LOAD_MORE: "START_LOAD_MORE",
  RESPONSE: "RESPONSE",
  RESPONSE_LOAD_MORE: "RESPONSE_LOAD_MORE",
  ERROR: "ERROR",
  ERROR_LOAD_MORE: "ERROR_LOAD_MORE",
  SET: "SET",
  ERROR_CANCELED: "ERROR_CANCELED",
  LOAD_MORE: "LOAD_MORE",
  UPDATE: "UPDATE",
  START_BULK: "START_BULK",
  END_BULK: "END_BULK",
  ERROR_BULK: "ERROR_BULK",
  RESPONSE_BULK: "RESPONSE_BULK",
});

const defaultConfig = {
  payload: { transform: (_) => _ },
  pagination: { next: (_) => _, onLoadMore: (_) => _ },
  bulk: { onOneResponse: (_) => _ },
};

const defaultSate = {
  data: undefined,
  loading: false,
  error: false,
  toNextLoadMore: true,
};

const reducer = (state, action) => {
  const { type, config, error, init, response } = action;
  switch (type) {
    case TYPES.START:
      return { ...state, loading: true };
    case TYPES.START_LOAD_MORE:
      return {
        ...state,
        loading: true,
        loadingMore: true,
        toLoadMore: false,
      };
    case TYPES.RESPONSE:
      return {
        ...state,
        loading: false,
        data: config.payload.transform(
          config.payload.path
            ? get(response, config.payload.path, config.payload.default)
            : response,
          config,
          response
        ),
      };
    case TYPES.RESPONSE_LOAD_MORE:
      return {
        ...state,
        loading: false,
        data: config.pagination.onLoadMore(
          config.payload.transform(
            config.payload.path
              ? get(response, config.payload.path, config.payload.default)
              : response,
            config,
            response
          ),
          state.data
        ),
        loadingMore: false,
        toNextLoadMore: !isEmpty(
          config.payload.transform(
            config.payload.path
              ? get(response, config.payload.path, config.payload.default)
              : { ...response },
            config
          )
        ),
      };
    case TYPES.ERROR:
      return { ...state, loading: false, error };
    case TYPES.ERROR_LOAD_MORE:
      return { ...state, loading: false, loadingMore: false, error };
    case TYPES.ERROR_CANCELED:
      return { ...state };
    case TYPES.SET:
      return { ...init(config) };
    case TYPES.LOAD_MORE: {
      let _config = state.config;
      if (state.toNextLoadMore) {
        _config = merge({}, state.config, {
          pagination: {
            current: state.config.pagination.next(
              state.config.pagination.current
            ),
          },
        });
        merge(_config, resolvePagination(_config));
      }
      return {
        ...state,
        config: _config,
        toLoadMore: true,
      };
    }
    case TYPES.UPDATE: {
      let _config = merge({}, state.config, config);
      console.log("config :>> ", config);
      return { ...state, config: _config };
    }
    case TYPES.START_BULK:
      return { ...state, loading: true, loadingBulk: true };
    case TYPES.END_BULK:
      return { ...state, loading: false, loadingBulk: false };
    case TYPES.ERROR_BULK:
      return { ...state, error, errorBulk: true };
    case TYPES.RESPONSE_BULK:
      return {
        ...state,
        data: config.bulk.onOneResponse(
          config.payload.transform(
            config.payload.path
              ? get(response, config.payload.path, config.payload.default)
              : response,
            config,
            response
          ),
          state.data
        ),
      };

    default:
      throw new Error("NO ACTION TYPE DEFINED");
  }
};

const resolveAlias = (config, action) => ({
  ...Object.keys(get(config, "alias", {})).reduce((acc, key) => {
    acc[key] = (args) => {
      let _config = get(config, `alias.${key}`, []).reduce((_acc, mapper) => {
        set(_acc, mapper.out, mapper.in ? get(args, mapper.in) : args);
        return _acc;
      }, {});
      _config = merge({}, config, _config);
      action(_config);
    };
    return acc;
  }, {}),
});

const resolvePagination = (_options) => ({
  ...(!get(_options, "pagination.path") || !get(_options, "pagination.current")
    ? {}
    : set({}, _options.pagination.path, _options.pagination.current)),
});

const resolveInitialPagination = (_options) => ({
  ...(!get(_options, "pagination.initial")
    ? {}
    : { pagination: { current: _options.pagination.initial } }),
});

const init = (config) => {
  let _config = merge(
    {},
    defaultConfig,
    resolveInitialPagination(config),
    config
  );
  merge(_config, resolvePagination(_config));
  return {
    ...defaultSate,
    config: { ..._config },
    data: get(_config, "payload.default"),
  };
};

const core = async (config, dispatch) => {
  const _config = { ...config };
  dispatch({ type: TYPES.START });
  try {
    const response = await api.request(_config);
    config.onData && config.onData(response);
    console.log("response :>> ", response);
    dispatch({ type: TYPES.RESPONSE, config: _config, response });
  } catch (error) {
    config.onError && config.onError(error);
    console.log("error :>> ", error);
    if (!axios.isCancel(error)) {
      dispatch({ type: TYPES.ERROR, config: _config, error });
    } else {
      dispatch({ type: TYPES.ERROR_CANCELED, config: _config, error });
    }
  }
};

const coreLoadMore = async (config, dispatch) => {
  const _config = { ...config };
  dispatch({ type: TYPES.START_LOAD_MORE });
  try {
    const response = await api.request(_config);
    dispatch({ type: TYPES.RESPONSE_LOAD_MORE, config: _config, response });
  } catch (error) {
    if (!axios.isCancel(error)) {
      dispatch({ type: TYPES.ERROR_LOAD_MORE, config: _config, error });
    } else {
      dispatch({ type: TYPES.ERROR_CANCELED, config: _config, error });
    }
  }
};

const coreBulk = async (config, dispatch, configs) => {
  const originalConfig = { ...config };
  dispatch({ type: TYPES.START_BULK });
  for (let index = 0; index < configs.length; index++) {
    const _config = merge({}, originalConfig, configs[index]);
    try {
      const response = await api.request(_config);
      dispatch({ type: TYPES.RESPONSE_BULK, config: _config, response });
    } catch (error) {
      if (!axios.isCancel(error)) {
        dispatch({ type: TYPES.ERROR_BULK, config: _config, error });
      } else {
        dispatch({ type: TYPES.ERROR_CANCELED, config: _config, error });
      }
    }
  }
  dispatch({ type: TYPES.END_BULK });
};

export const useRequest = (initialConfig) => {
  const source = useRef(CancelToken.source());
  const active = useRef(false);

  const [state, dispatch] = useReducer(reducer, initialConfig, init);

  const aliasAction = (_config) => {
    source.current.cancel("USER SET CONFIG");
    source.current = CancelToken.source();
    active.current = true;
    dispatch({ type: TYPES.SET, config: _config, init });
  };

  const alias = useRef(resolveAlias(state.config, aliasAction));

  useEffect(() => {
    active.current = !get(initialConfig, "lazy");

    source.current = CancelToken.source();
    alias.current = resolveAlias(state.config, aliasAction);

    return () => {
      source.current.cancel("UNMOUNTED");
    };
  }, []);

  useEffect(() => {
    if (state.toLoadMore) {
      coreLoadMore(
        { cancelToken: source.current.token, ...state.config },
        dispatch
      );
    } else if (active.current) {
      core({ cancelToken: source.current.token, ...state.config }, dispatch);
    }
  }, [state.config]);

  const reload = () => {
    core({ cancelToken: source.current.token, ...state.config }, dispatch);
  };

  const bulk = (configs) => {
    coreBulk(
      { cancelToken: source.current.token, ...state.config },
      dispatch,
      configs
    );
  };

  const loadMore = () => {
    if (!get(state.config, "pagination.current")) return;
    active.current = true;
    dispatch({ type: TYPES.LOAD_MORE });
  };

  const updateConfig = (_config) => {
    alias.current = resolveAlias(merge({}, state.config, _config), aliasAction);
    _config.lazy && (active.current = !get(_config, "lazy"));
    console.log(_config);
    dispatch({ type: TYPES.UPDATE, config: _config });
  };

  const setConfig = (_config) => {
    source.current.cancel("USER SET CONFIG");
    source.current = CancelToken.source();
    active.current = !get(_config, "lazy");
    alias.current = resolveAlias(_config, aliasAction);
    dispatch({ type: TYPES.SET, config: _config, init });
  };

  return {
    ...state,
    alias: alias.current,
    reload,
    loadMore,
    setConfig,
    updateConfig,
    bulk,
  };
};
