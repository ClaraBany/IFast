# API REST do IFast

Referência dos endpoints implementados pelo backend Spring Boot.

- **URL local:** `http://localhost:8080`
- **Formato:** JSON (`Content-Type: application/json`)
- **Autenticação:** todos os endpoints, exceto login e cadastro, exigem JWT no header `Authorization: Bearer <token>`.
- **Datas:** `LocalDateTime` usa ISO 8601 sem fuso horário, por exemplo `2026-11-10T08:30:00`. Datas de filtro usam `YYYY-MM-DD`.
- Os nomes de propriedades JSON são *camelCase*. Valores de enums enviados em query strings e bodies devem usar os nomes em maiúsculas apresentados abaixo.

## Autenticação

| Método | Endpoint | Entrada | Retorno |
|---|---|---|---|
| `POST` | `/register` | `RegisterDto` | `200 AuthResponseDto` |
| `POST` | `/login` | `LoginDto` | `200 AuthResponseDto` |
| `POST` | `/login/google` | `LoginGoogleDto` | `200 AuthResponseDto` |

### Corpos

`POST /register`

```json
{
  "name": "Nome Sobrenome",
  "email": "aluno@ifnmg.edu.br",
  "password": "senha123"
}
```

- `name`: obrigatório, de 10 a 100 caracteres.
- `email`: obrigatório, e-mail válido com domínio institucional `ifnmg.edu.br`.
- `password`: obrigatório, mínimo de 6 caracteres.

`POST /login`

```json
{
  "email": "aluno@ifnmg.edu.br",
  "password": "senha123"
}
```

`POST /login/google`

```json
{
  "idToken": "token-de-identidade-do-google"
}
```

`AuthResponseDto`:

```json
{
  "user": {
    "id": 1,
    "name": "Nome Sobrenome",
    "email": "aluno@ifnmg.edu.br",
    "pictureUrl": null,
    "phoneNumber": null,
    "address": null
  },
  "token": "jwt"
}
```

Use o valor de `token` como `Bearer` nas chamadas autenticadas.

## Usuários

| Método | Endpoint | Entrada | Retorno |
|---|---|---|---|
| `GET` | `/users/me` | — | `200 UserDto` |
| `GET` | `/users/{id}` | `id`: identificador do usuário | `200 ProfileResponseDto` |
| `PUT` | `/users/me` | `UpdateProfileDto` | `200 UserDto` |

`UpdateProfileDto`:

```json
{
  "name": "Nome Sobrenome",
  "address": "CENTRO",
  "phoneNumber": "(38) 99999-9999"
}
```

- `name`: obrigatório, de 10 a 100 caracteres.
- `address`: opcional; não pode ser `IFNMG`.
- `phoneNumber`: opcional; formato `(DD) 99999-9999`.

`UserDto` contém `id`, `name`, `email`, `pictureUrl`, `phoneNumber` e `address`.
`ProfileResponseDto` contém `user`, `ridesAsDriverCount` e `ridesAsPassengerCount`.
As contagens consideram apenas viagens concluídas: ofertas com status `COMPLETED` como motorista e bookings `ACCEPTED` associados a ofertas `COMPLETED` como passageiro. Itens cancelados não são contabilizados.

## Veículos

| Método | Endpoint | Entrada | Retorno |
|---|---|---|---|
| `GET` | `/vehicles` | — | `200 VehicleDto[]` |
| `GET` | `/vehicles/{vehicleId}` | `vehicleId`: identificador do veículo | `200 VehicleDto` |
| `POST` | `/vehicles` | `VehicleDto` | `201 IdResponseDto` |
| `PUT` | `/vehicles/{vehicleId}` | `vehicleId` e `VehicleDto` | `200 IdResponseDto` |
| `DELETE` | `/vehicles/{vehicleId}` | `vehicleId` | `204`, sem corpo |

Corpo para criar ou atualizar:

```json
{
  "model": "Hatch",
  "color": "Prata",
  "capacity": 4,
  "plate": "ABC1D23"
}
```

`model` e `color` são obrigatórios. `plate`, quando enviada, deve seguir o formato antigo `ABC1234` ou Mercosul `ABC1D23`. `capacity` é um inteiro. `id` é retornado no DTO de veículo, mas não é necessário no corpo.

## Ofertas de carona

| Método | Endpoint | Entrada | Retorno |
|---|---|---|---|
| `GET` | `/ride-offers` | Filtros opcionais descritos abaixo | `200 RideOfferSummaryDto[]` |
| `GET` | `/ride-offers/my-offers?status={status}` | `status`: `OPEN` ou `COMPLETED` (obrigatório) | `200 RideOfferDto[]` |
| `GET` | `/ride-offers/{rideOfferId}` | `rideOfferId`: identificador da oferta | `200 RideOfferDto` |
| `POST` | `/ride-offers` | `CreateRideOfferDto` | `201 IdResponseDto` |
| `PUT` | `/ride-offers/{rideOfferId}` | `rideOfferId` e `CreateRideOfferDto` | `200 IdResponseDto` |
| `PATCH` | `/ride-offers/{rideOfferId}/complete` | `rideOfferId` | `204`, sem corpo |
| `PATCH` | `/ride-offers/{rideOfferId}/cancel` | `rideOfferId` | `204`, sem corpo |

Filtros opcionais de `GET /ride-offers`:

| Parâmetro | Tipo | Valores/descrição |
|---|---|---|
| `period` | enum | `MORNING`, `AFTERNOON`, `EVENING` |
| `date` | data | `YYYY-MM-DD`; hoje ou data futura |
| `origin` | enum | Bairro de origem |
| `destination` | enum | Bairro de destino |

Exemplo: `/ride-offers?origin=CENTRO&destination=SAO_PEDRO&date=2026-11-10&period=MORNING`.
Essa busca retorna ofertas `AVAILABLE`, futuras e de outros motoristas.

Corpo de criação/atualização:

```json
{
  "vehicle": {
    "model": "Hatch",
    "color": "Prata",
    "capacity": 4,
    "plate": "ABC1D23"
  },
  "seatsCapacity": 3,
  "origin": "CENTRO",
  "destination": "SAO_PEDRO",
  "departureDateTime": "2026-11-10T08:30:00",
  "description": "Saída pelo portão principal",
  "isRoundTrip": false,
  "returnDateTime": null
}
```

- `vehicle`, `seatsCapacity`, `origin`, `destination`, `departureDateTime` e `isRoundTrip` são obrigatórios.
- `seatsCapacity`: de 1 a 4 e não pode ultrapassar a capacidade do veículo.
- Origem e destino devem ser diferentes.
- `description`: opcional, até 500 caracteres.
- `departureDateTime` e `returnDateTime` não podem estar no passado nem ultrapassar o limite configurado de dias futuros.
- Se `isRoundTrip` for `true`, `returnDateTime` é obrigatório e posterior à partida.
- Em ida e volta, o endpoint cria as duas ofertas, mas o corpo de resposta contém o ID da oferta de ida.

`RideOfferDto` contém `id`, `driver`, `vehicle`, `seatsCapacity`, `seatsTaken`, `origin`, `destination`, `status`, `departureDateTime` e `description`.
`RideOfferSummaryDto` tem os mesmos dados, exceto `vehicle` e `description`.

Na listagem pessoal, `COMPLETED` inclui ofertas `COMPLETED` e `CANCELLED`; `OPEN` inclui os demais status.

## Solicitações de carona

| Método | Endpoint | Entrada | Retorno |
|---|---|---|---|
| `GET` | `/ride-requests` | Filtros opcionais descritos abaixo | `200 RideRequestDto[]` |
| `GET` | `/ride-requests/my-requests?status={status}` | `status`: `OPEN` ou `COMPLETED` (obrigatório) | `200 RideRequestDto[]` |
| `GET` | `/ride-requests/{rideRequestId}` | `rideRequestId`: identificador da solicitação | `200 RideRequestDto` |
| `GET` | `/ride-requests/{rideRequestId}/matching-offers` | `rideRequestId`: identificador da solicitação | `200 RideOfferSummaryDto[]` |
| `POST` | `/ride-requests` | `CreateRideRequestDto` | `201 IdResponseDto` |
| `PUT` | `/ride-requests/{rideRequestId}` | `rideRequestId` e `CreateRideRequestDto` | `200 IdResponseDto` |
| `PATCH` | `/ride-requests/{rideRequestId}/cancel` | `rideRequestId` | `204`, sem corpo |

Os filtros de `GET /ride-requests` são os mesmos da busca de ofertas: `period`, `date`, `origin` e `destination`. Essa busca retorna solicitações `PENDING`, futuras e de outros usuários.

Corpo de criação/atualização:

```json
{
  "origin": "CENTRO",
  "destination": "SAO_PEDRO",
  "desiredDepartureStart": "2026-11-10T08:00:00",
  "desiredDepartureEnd": "2026-11-10T09:00:00"
}
```

Todos os campos são obrigatórios. Origem e destino devem ser diferentes. O horário final deve ser posterior ao inicial, ambos devem ser no mesmo dia e não podem exceder o limite configurado de dias futuros.

`RideRequestDto` contém `id`, `status`, `requester`, `origin`, `destination`, `desiredDepartureStart` e `desiredDepartureEnd`.

Na listagem pessoal, `OPEN` inclui solicitações `PENDING`; `COMPLETED` inclui solicitações `ACCEPTED` e `CANCELLED`.

## Reservas (bookings)

| Método | Endpoint | Entrada | Retorno |
|---|---|---|---|
| `GET` | `/bookings/my-bookings?status={status}` | `status`: `OPEN` ou `COMPLETED` (obrigatório) | `200 RideBookingDto[]` |
| `GET` | `/ride-offers/{rideOfferId}/bookings` | `rideOfferId`; `status` opcional | `200 RideBookingDto[]` |
| `GET` | `/ride-requests/{rideRequestId}/bookings` | `rideRequestId`; `status` opcional | `200 RideBookingDto[]` |
| `POST` | `/ride-offers/{rideOfferId}/bookings` | `rideOfferId` | `201 IdResponseDto` |
| `POST` | `/ride-requests/{rideRequestId}/bookings` | `rideRequestId` e corpo abaixo | `201 IdResponseDto` |
| `PATCH` | `/bookings/{bookingId}/accept` | `bookingId` | `204`, sem corpo |
| `PATCH` | `/bookings/{bookingId}/reject` | `bookingId` | `204`, sem corpo |
| `PATCH` | `/bookings/{bookingId}/cancel` | `bookingId` | `204`, sem corpo |

O cancelamento pode ser realizado pelo passageiro da reserva quando ela está `PENDING` ou `ACCEPTED`. Reservas aceitas liberam a vaga correspondente na oferta. Se outro usuário tentar cancelar a reserva, a API retorna `403`; se a reserva estiver em um estado que não permite cancelamento, retorna `409`.

O parâmetro opcional `status` nas consultas por oferta/solicitação aceita `PENDING`, `ACCEPTED`, `REJECTED` ou `CANCELLED`. Sem ele, são retornados todos os bookings associados.

Corpo de `POST /ride-requests/{rideRequestId}/bookings`:

```json
{
  "rideOfferId": 10
}
```

`rideOfferId` é obrigatório. A solicitação deve estar `PENDING` e a oferta deve estar `AVAILABLE`. Para criar booking diretamente em uma oferta, `POST /ride-offers/{rideOfferId}/bookings` não recebe corpo. Não é permitido criar mais de um booking para a combinação passageiro/oferta.

`RideBookingDto` contém:

```json
{
  "id": 25,
  "passenger": {
    "id": 2,
    "name": "Nome Sobrenome",
    "pictureUrl": null
  },
  "rideOffer": {
    "id": 10,
    "driver": {
      "id": 1,
      "name": "Motorista",
      "pictureUrl": null
    },
    "seatsCapacity": 3,
    "seatsTaken": 1,
    "origin": "CENTRO",
    "destination": "SAO_PEDRO",
    "departureDateTime": "2026-11-10T08:30:00",
    "status": "AVAILABLE"
  },
  "rideRequestId": null,
  "status": "PENDING"
}
```

Na listagem pessoal, `OPEN` inclui bookings `PENDING` e bookings `ACCEPTED` cuja oferta ainda não está `COMPLETED`. `COMPLETED` inclui os demais: bookings diferentes de `PENDING`, exceto os `ACCEPTED` cuja oferta ainda não foi concluída.

## Formatos comuns

### `IdResponseDto`

```json
{
  "id": 10
}
```

### `ErrorResponseDto`

```json
{
  "message": "Falha na validação",
  "errors": [
    "name: O nome é obrigatório"
  ]
}
```

`errors` pode ser `null` quando não há uma lista de detalhes.

### Status HTTP documentados pela aplicação

| Status | Quando ocorre |
|---|---|
| `200 OK` | Consulta, login, atualização ou operação com retorno |
| `201 Created` | Criação de veículo, oferta, solicitação ou booking |
| `204 No Content` | Operação concluída sem corpo |
| `400 Bad Request` | Body inválido/ausente ou parâmetro inválido |
| `401 Unauthorized` | Credenciais ou JWT inválidos/ausentes |
| `403 Forbidden` | Usuário sem autorização para a operação |
| `404 Not Found` | Rota inexistente |
| `409 Conflict` | Estado incompatível ou booking duplicado |
| `422 Unprocessable Content` | Falha de validação, regra de negócio ou entidade não encontrada |
| `500 Internal Server Error` | Erro não tratado |

## Enums

`Neighborhoods` (origem, destino e endereço):
`IFNMG`, `CIDADE_NOVA`, `CIDADE_VERDE`, `CIDADE_JARDIM`, `SAO_PEDRO`, `SANTO_ANTONIO`, `CENTRO`, `PLANALTO`, `RESIDENCIAL_LARANJEIRAS`, `PARQUE_SAO_JOAO`, `SAO_JUDAS_TADEU`, `DARWIN_CORDEIRO`, `TERESA_CRISTINA`, `JARDIM_PARAISO`, `MONTE_DAS_OLIVEIRAS`, `PEDRO_GOMES`, `SAO_FRANCISCO`, `PANORAMICO`.

Outros enums:

- `Period`: `MORNING`, `AFTERNOON`, `EVENING`.
- `RideListStatus`: `OPEN`, `COMPLETED`.
- `StatusOffer`: `AVAILABLE`, `FULL`, `CANCELLED`, `COMPLETED`.
- `StatusRequest`: `PENDING`, `ACCEPTED`, `CANCELLED`.
- `StatusBooking`: `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`.
