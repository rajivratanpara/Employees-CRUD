import { createServer, Model } from "miragejs";

export function makeServer() {
  createServer({
    models: {
      employee: Model,
    },

    seeds(server) {
      server.create("employee", { id: "1", name: "John Doe", position: "Manager" });
      server.create("employee", { id: '2', name: "Jane Smith", position: "Engineer" });
      // Add 8 more employees here...
    },

    routes() {
      this.namespace = "api";

      this.get("/employees", (schema) => {
        return schema.all("employee");
      });

      this.post("/employees", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        return schema.create("employee", attrs);
      });

      this.put("/employees/:id", (schema:any, request) => {
        let id = request.params.id;
        let attrs = JSON.parse(request.requestBody);
        let employee = schema.find("employee", id);
        return employee?.update(attrs);
      });

      this.del("/employees/:id", (schema:any, request) => {
        let id = request.params.id;
        return schema.find("employee", id)?.destroy();
      });
    },
  });
}
