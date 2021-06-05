package ir.ac.sbu.evaluation.dto.user.master;

import ir.ac.sbu.evaluation.model.user.Master;
import java.util.Objects;
import javax.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MasterRegisterDto {

    @NotNull
    private MasterDto master;

    @NotNull
    private long facultyId;

    public MasterRegisterDto() {
    }

    @Builder
    public MasterRegisterDto(MasterDto master, long facultyId) {
        this.master = master;
        this.facultyId = facultyId;
    }

    public static MasterRegisterDto from(Master master, long facultyId) {
        return builder()
                .master(MasterDto.from(master))
                .facultyId(facultyId)
                .build();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        MasterRegisterDto that = (MasterRegisterDto) o;
        return facultyId == that.facultyId && Objects.equals(master, that.master);
    }

    @Override
    public int hashCode() {
        return Objects.hash(master, facultyId);
    }
}
