--
-- PostgreSQL database dump
--

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-03-28 10:09:14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 239 (class 1255 OID 16572)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16573)
-- Name: id_carrera_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_carrera_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.id_carrera_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16574)
-- Name: carreras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carreras (
    id_carrera integer DEFAULT nextval('public.id_carrera_seq'::regclass) NOT NULL,
    id_universidad integer,
    nombre character varying(200) NOT NULL,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.carreras OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16583)
-- Name: id_subsidio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_subsidio_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.id_subsidio_seq OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16584)
-- Name: convenios_subsidios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.convenios_subsidios (
    id_subsidio integer DEFAULT nextval('public.id_subsidio_seq'::regclass) NOT NULL,
    nombre character varying(200) NOT NULL,
    entidad character varying(200),
    descripcion text,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.convenios_subsidios OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16595)
-- Name: preguntas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.preguntas (
    id_pregunta integer NOT NULL,
    rasgo character varying(1) NOT NULL,
    descripcion text NOT NULL,
    tipo character varying(20) DEFAULT 'opcion_multiple'::character varying,
    nivel integer DEFAULT 1,
    activa boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.preguntas OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16608)
-- Name: id_pregunta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_pregunta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.id_pregunta_seq OWNER TO postgres;

--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 224
-- Name: id_pregunta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.id_pregunta_seq OWNED BY public.preguntas.id_pregunta;


--
-- TOC entry 225 (class 1259 OID 16609)
-- Name: id_respuesta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_respuesta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.id_respuesta_seq OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16610)
-- Name: id_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_rol_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.id_rol_seq OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16611)
-- Name: id_universidad_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_universidad_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.id_universidad_seq OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16612)
-- Name: id_usuario_carrera_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_usuario_carrera_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.id_usuario_carrera_seq OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16613)
-- Name: id_usuario_rol_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_usuario_rol_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.id_usuario_rol_seq OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16614)
-- Name: id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_usuario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.id_usuario_seq OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16615)
-- Name: id_usuario_subsidio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.id_usuario_subsidio_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.id_usuario_subsidio_seq OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16616)
-- Name: respuestas_cuestionario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.respuestas_cuestionario (
    id_respuesta integer DEFAULT nextval('public.id_respuesta_seq'::regclass) NOT NULL,
    id_usuario integer,
    id_pregunta integer,
    valor integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT respuestas_cuestionario_valor_check CHECK (((valor >= 1) AND (valor <= 5)))
);


ALTER TABLE public.respuestas_cuestionario OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16623)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id_rol integer DEFAULT nextval('public.id_rol_seq'::regclass) NOT NULL,
    nombre character varying(50) NOT NULL,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16632)
-- Name: universidades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.universidades (
    id_universidad integer DEFAULT nextval('public.id_universidad_seq'::regclass) NOT NULL,
    nombre character varying(200) NOT NULL,
    ubicacion text,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.universidades OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16643)
-- Name: usuario_carreras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_carreras (
    id_usuario_carrera integer DEFAULT nextval('public.id_usuario_carrera_seq'::regclass) NOT NULL,
    id_usuario integer,
    id_carrera integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuario_carreras OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16649)
-- Name: usuario_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_roles (
    id_usuario_rol integer DEFAULT nextval('public.id_usuario_rol_seq'::regclass) NOT NULL,
    id_usuario integer,
    id_rol integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuario_roles OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16655)
-- Name: usuario_subsidios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_subsidios (
    id_usuario_subsidio integer DEFAULT nextval('public.id_usuario_subsidio_seq'::regclass) NOT NULL,
    id_usuario integer,
    id_subsidio integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuario_subsidios OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16661)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id_usuario integer DEFAULT nextval('public.id_usuario_seq'::regclass) NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash text NOT NULL,
    tipo_documento character varying(10) NOT NULL,
    numero_documento character varying(25) NOT NULL,
    estado boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 4910 (class 2604 OID 16676)
-- Name: preguntas id_pregunta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preguntas ALTER COLUMN id_pregunta SET DEFAULT nextval('public.id_pregunta_seq'::regclass);


--
-- TOC entry 4938 (class 2606 OID 16678)
-- Name: carreras carreras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_pkey PRIMARY KEY (id_carrera);


--
-- TOC entry 4940 (class 2606 OID 16680)
-- Name: convenios_subsidios convenios_subsidios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.convenios_subsidios
    ADD CONSTRAINT convenios_subsidios_pkey PRIMARY KEY (id_subsidio);


--
-- TOC entry 4942 (class 2606 OID 16682)
-- Name: preguntas preguntas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preguntas
    ADD CONSTRAINT preguntas_pkey PRIMARY KEY (id_pregunta);


--
-- TOC entry 4944 (class 2606 OID 16684)
-- Name: respuestas_cuestionario respuestas_cuestionario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas_cuestionario
    ADD CONSTRAINT respuestas_cuestionario_pkey PRIMARY KEY (id_respuesta);


--
-- TOC entry 4946 (class 2606 OID 16686)
-- Name: roles roles_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key UNIQUE (nombre);


--
-- TOC entry 4948 (class 2606 OID 16688)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_rol);


--
-- TOC entry 4960 (class 2606 OID 16690)
-- Name: usuarios unique_documento; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT unique_documento UNIQUE (tipo_documento, numero_documento);


--
-- TOC entry 4950 (class 2606 OID 16692)
-- Name: universidades universidades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universidades
    ADD CONSTRAINT universidades_pkey PRIMARY KEY (id_universidad);


--
-- TOC entry 4952 (class 2606 OID 16694)
-- Name: usuario_carreras usuario_carreras_id_usuario_id_carrera_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_carreras
    ADD CONSTRAINT usuario_carreras_id_usuario_id_carrera_key UNIQUE (id_usuario, id_carrera);


--
-- TOC entry 4954 (class 2606 OID 16696)
-- Name: usuario_carreras usuario_carreras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_carreras
    ADD CONSTRAINT usuario_carreras_pkey PRIMARY KEY (id_usuario_carrera);


--
-- TOC entry 4956 (class 2606 OID 16698)
-- Name: usuario_roles usuario_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_pkey PRIMARY KEY (id_usuario_rol);


--
-- TOC entry 4958 (class 2606 OID 16700)
-- Name: usuario_subsidios usuario_subsidios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_subsidios
    ADD CONSTRAINT usuario_subsidios_pkey PRIMARY KEY (id_usuario_subsidio);


--
-- TOC entry 4962 (class 2606 OID 16702)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4964 (class 2606 OID 16704)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4974 (class 2620 OID 16705)
-- Name: carreras trg_update_carreras; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_carreras BEFORE UPDATE ON public.carreras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4976 (class 2620 OID 16706)
-- Name: roles trg_update_roles; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_roles BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4975 (class 2620 OID 16707)
-- Name: convenios_subsidios trg_update_subsidios; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_subsidios BEFORE UPDATE ON public.convenios_subsidios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4977 (class 2620 OID 16708)
-- Name: universidades trg_update_universidades; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_universidades BEFORE UPDATE ON public.universidades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4978 (class 2620 OID 16709)
-- Name: usuarios trg_update_usuarios; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_update_usuarios BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4965 (class 2606 OID 16710)
-- Name: carreras carreras_id_universidad_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carreras
    ADD CONSTRAINT carreras_id_universidad_fkey FOREIGN KEY (id_universidad) REFERENCES public.universidades(id_universidad) ON DELETE CASCADE;


--
-- TOC entry 4966 (class 2606 OID 16715)
-- Name: respuestas_cuestionario respuestas_cuestionario_id_pregunta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas_cuestionario
    ADD CONSTRAINT respuestas_cuestionario_id_pregunta_fkey FOREIGN KEY (id_pregunta) REFERENCES public.preguntas(id_pregunta) ON DELETE CASCADE;


--
-- TOC entry 4967 (class 2606 OID 16720)
-- Name: respuestas_cuestionario respuestas_cuestionario_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas_cuestionario
    ADD CONSTRAINT respuestas_cuestionario_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4968 (class 2606 OID 16725)
-- Name: usuario_carreras usuario_carreras_id_carrera_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_carreras
    ADD CONSTRAINT usuario_carreras_id_carrera_fkey FOREIGN KEY (id_carrera) REFERENCES public.carreras(id_carrera) ON DELETE CASCADE;


--
-- TOC entry 4969 (class 2606 OID 16730)
-- Name: usuario_carreras usuario_carreras_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_carreras
    ADD CONSTRAINT usuario_carreras_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4970 (class 2606 OID 16735)
-- Name: usuario_roles usuario_roles_id_rol_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_id_rol_fkey FOREIGN KEY (id_rol) REFERENCES public.roles(id_rol) ON DELETE CASCADE;


--
-- TOC entry 4971 (class 2606 OID 16740)
-- Name: usuario_roles usuario_roles_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


--
-- TOC entry 4972 (class 2606 OID 16745)
-- Name: usuario_subsidios usuario_subsidios_id_subsidio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_subsidios
    ADD CONSTRAINT usuario_subsidios_id_subsidio_fkey FOREIGN KEY (id_subsidio) REFERENCES public.convenios_subsidios(id_subsidio) ON DELETE CASCADE;


--
-- TOC entry 4973 (class 2606 OID 16750)
-- Name: usuario_subsidios usuario_subsidios_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_subsidios
    ADD CONSTRAINT usuario_subsidios_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE;


-- Completed on 2026-03-28 10:09:14

--
-- PostgreSQL database dump complete
--

